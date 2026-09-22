import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, Platform, ScrollView, TextInput, type KeyboardEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";

export function useKeyboardFormScroll() {
  const scrollViewRef = useRef<ScrollView>(null);
  const focusedInputRef = useRef<TextInput | null>(null);
  const scrollOffset = useRef(0);
  const keyboardTop = useRef<number | null>(null);
  const frame = useRef<number | null>(null);
  const revision = useRef(0);
  const [bottomOverlap, setBottomOverlap] = useState(0);

  const cancelPendingScroll = useCallback(() => {
    revision.current += 1;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  const ensureVisible = useCallback(() => {
    cancelPendingScroll();
    if (Platform.OS === "web" || keyboardTop.current === null) return;
    const currentRevision = revision.current;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      scrollViewRef.current?.getNativeScrollRef()?.measureInWindow((_x, viewportTop, _width, viewportHeight) => {
        if (revision.current !== currentRevision || keyboardTop.current === null) return;
        const viewportBottom = viewportTop + viewportHeight;
        const visibleBottom = Math.min(viewportBottom, (keyboardTop.current*0.95));
        // agrego 0.95% para dejar un espacio entre el teclado y el campo
        // Solo compensar la porción que el KeyboardAvoidingView padre no haya reducido.
        // Sin este espacio, el scroll llega al final antes de descubrir los últimos campos.
        setBottomOverlap(Math.max(0, Math.ceil(viewportBottom - visibleBottom)));
        const input = focusedInputRef.current;
        input?.measureInWindow((_inputX, inputTop, _inputWidth, inputHeight) => {
          if (revision.current !== currentRevision || focusedInputRef.current !== input) return;
          const top = viewportTop + 16;
          const bottom = visibleBottom - 24;
          const delta = inputHeight > bottom - top
            ? inputTop - top
            : inputTop < top ? inputTop - top : Math.max(0, inputTop + inputHeight - bottom);
          if (Math.abs(delta) > 1) {
            scrollViewRef.current?.scrollTo({ y: Math.max(0, scrollOffset.current + delta), animated: true });
          }
        });
      });
    });
  }, [cancelPendingScroll]);

  useEffect(() => {
    const onShow = (event: KeyboardEvent) => {
      keyboardTop.current = event.endCoordinates.screenY;
      ensureVisible();
    };
    const onHide = () => {
      keyboardTop.current = null;
      setBottomOverlap(0);
      cancelPendingScroll();
    };
    const subscriptions = [
      Keyboard.addListener("keyboardDidShow", onShow),
      Keyboard.addListener("keyboardDidChangeFrame", onShow),
      Keyboard.addListener("keyboardDidHide", onHide),
    ];
    const metrics = Keyboard.metrics();
    if (metrics) {
      keyboardTop.current = metrics.screenY;
      ensureVisible();
    }
    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
      cancelPendingScroll();
    };
  }, [cancelPendingScroll, ensureVisible]);

  const onFocus = (input: TextInput | null) => {
    focusedInputRef.current = input;
    ensureVisible();
  };
  const onBlur = (input: TextInput | null) => {
    if (focusedInputRef.current !== input) return;
    focusedInputRef.current = null;
    cancelPendingScroll();
  };
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  return { scrollViewRef, bottomOverlap, ensureVisible, onFocus, onBlur, onScroll };
}
