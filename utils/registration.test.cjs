const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

function load(relativePath, dependencies = {}, globals = {}) {
  const source = readFileSync(path.join(__dirname, "..", relativePath), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports, require: (name) => {
    if (!(name in dependencies)) throw new Error(`Unmocked dependency: ${name}`);
    return dependencies[name];
  }, ...globals });
  return exports;
}

const registration = load("utils/registration.ts");
const validations = load("utils/validations.ts");

test("fecha: barras automáticas, pegado, límite y borrado sin atascarse", () => {
  let value = "";
  for (const [digit, expected] of [["2", "2"], ["1", "21/"], ["0", "21/0"], ["9", "21/09/"], ["1", "21/09/1"], ["9", "21/09/19"], ["9", "21/09/199"], ["0", "21/09/1990"]]) {
    value = registration.formatBirthDate(value + digit, value);
    assert.equal(value, expected);
  }
  assert.equal(registration.formatBirthDate("21091990111"), "21/09/1990");
  assert.equal(registration.formatBirthDate("21/09/1990"), "21/09/1990");
  assert.equal(registration.formatBirthDate("abc21x09x1990"), "21/09/1990");
  assert.equal(registration.formatBirthDate("21/09", "21/09/"), "21/0");
  assert.equal(registration.formatBirthDate("21", "21/"), "2");
  while (value) value = registration.formatBirthDate(value.slice(0, -1), value);
  assert.equal(value, "");
});

test("validación de fecha y coincidencia exacta de contraseñas", () => {
  for (const value of ["", "21/09/", "31/04/1990", "29/02/2023", "21/13/1990", "21/09/2999"]) {
    assert.ok(registration.validateBirthDate(value));
  }
  assert.equal(registration.validateBirthDate("29/02/2000"), null);
  assert.equal(registration.validateBirthDate("21/09/1990"), null);
  assert.ok(registration.validatePasswordConfirmation("Abc1234!", ""));
  assert.ok(registration.validatePasswordConfirmation("Abc1234!", "abc1234!"));
  assert.equal(registration.validatePasswordConfirmation("Abc1234!", "Abc1234!"), null);
});

function hooks() {
  const slots = [];
  const effects = [];
  let cursor = 0;
  const react = {
    useRef: (value) => slots[cursor++] ||= { current: value },
    useState: (value) => {
      const index = cursor++;
      if (!(index in slots)) slots[index] = value;
      return [slots[index], (next) => { slots[index] = typeof next === "function" ? next(slots[index]) : next; }];
    },
    useCallback: (callback) => callback,
    useEffect: (effect) => { const index = cursor++; if (!(index in slots)) slots[index] = effects.push(effect()); },
  };
  return { react, render: (fn) => { cursor = 0; return fn(); }, cleanup: () => effects.forEach((fn) => fn?.()) };
}

for (const os of ["android", "ios"]) {
  test(`${os}: últimos campos, margen disponible, resize y limpieza (geometría simulada)`, () => {
    const state = hooks();
    const listeners = new Map();
    const frames = new Map();
    let id = 0;
    let offset = 0;
    let viewportHeight = 740;
    let logicalTop = 1080;
    let inputHeight = 48;
    const { useKeyboardFormScroll } = load("components/useKeyboardFormScroll.ts", {
      react: state.react,
      "react-native": { Platform: { OS: os }, Keyboard: {
        metrics: () => undefined,
        addListener: (name, fn) => { listeners.set(name, fn); return { remove: () => listeners.delete(name) }; },
      } },
    }, {
      requestAnimationFrame: (fn) => { frames.set(++id, fn); return id; },
      cancelAnimationFrame: (key) => frames.delete(key),
    });
    let hook = state.render(useKeyboardFormScroll);
    const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach((fn) => fn()); };
    hook.scrollViewRef.current = {
      getNativeScrollRef: () => ({ measureInWindow: (fn) => fn(0, 36, 390, viewportHeight) }),
      scrollTo: ({ y }) => {
        offset = Math.min(y, 1152 + hook.bottomOverlap - viewportHeight);
        hook.onScroll({ nativeEvent: { contentOffset: { y: offset } } });
      },
    };
    const input = { measureInWindow: (fn) => fn(0, 36 + logicalTop - offset, 340, inputHeight) };
    hook.onFocus(input);
    flush();
    assert.equal(offset, 0);
    listeners.get("keyboardDidShow")({ endCoordinates: { screenY: 480 } });
    flush();
    hook = state.render(useKeyboardFormScroll);
    assert.equal(hook.bottomOverlap, 296);
    hook.ensureVisible(); // onContentSizeChange después de reservar el margen
    flush();
    assert.equal(offset, 708);
    assert.equal(36 + logicalTop - offset + inputHeight, 456);

    viewportHeight = 444; // KeyboardAvoidingView ya redujo el espacio
    hook.ensureVisible();
    flush();
    hook = state.render(useKeyboardFormScroll);
    assert.equal(hook.bottomOverlap, 0, "no compensar dos veces el teclado");
    logicalTop = 850;
    inputHeight = 144;
    offset = 0;
    hook.onScroll({ nativeEvent: { contentOffset: { y: offset } } });
    hook.onFocus(input);
    flush();
    assert.equal(36 + logicalTop - offset + inputHeight, 456, "domicilio completo visible");
    const nextInput = { measureInWindow: input.measureInWindow };
    hook.onFocus(nextInput);
    hook.onBlur(input);
    assert.equal(frames.size, 1, "blur anterior no cancela el nuevo foco");
    listeners.get("keyboardDidHide")();
    assert.equal(frames.size, 0);
    state.cleanup();
    assert.equal(listeners.size, 0);
  });
}

for (const os of ["android", "ios"]) {
test(`${os}: registro, siguiente, IME, domicilio, ojo y confirmación`, () => {
  const state = hooks();
  const jsx = (type, props) => ({ type, props });
  const native = Object.fromEntries(["View", "Text", "Pressable", "ScrollView", "Image", "Modal", "FlatList", "InputAccessoryView"].map((name) => [name, name]));
  let submissions = 0;
  const { RegisterScreen } = load("screens/RegisterScreen.tsx", {
    react: state.react,
    "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "Fragment" },
    "react-native": { ...native, Platform: { OS: os }, Keyboard: { dismiss() {} } },
    "../components/InputWithError": { InputWithError: "InputWithError" },
    "../components/Icons": { EyeIcon: "EyeIcon" },
    "../components/useKeyboardFormScroll": { useKeyboardFormScroll: () => ({ scrollViewRef: { current: null }, bottomOverlap: 100, ensureVisible() {}, onFocus() {}, onBlur() {}, onScroll() {} }) },
    "../utils/registration": registration,
    "../utils/validations": validations,
    "../constants/data": { provincias: ["Buenos Aires"] },
    "../assets/gdes-logo.png": {},
  }, { requestAnimationFrame: () => 1, cancelAnimationFrame() {} });
  let tree;
  const render = () => { tree = state.render(() => RegisterScreen({ onRegister: () => submissions++, onBack() {} })); };
  const nodes = () => {
    const all = [];
    const visit = (node) => {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node || typeof node !== "object") return;
      all.push(node);
      visit(node.props?.children);
    };
    visit(tree);
    return all;
  };
  const field = (label) => nodes().find((node) => node.type === "InputWithError" && node.props.label === label).props;
  const submit = () => nodes().find((node) => node.type === "Pressable" && node.props.children?.props?.children === "Registrarse").props.onPress();
  render();
  let focused = false;
  field("Apellido").inputRef({ focus: () => { focused = true; } });
  field("Nombre").onSubmitEditing({ nativeEvent: { isComposing: true } });
  assert.equal(focused, false);
  field("Nombre").onSubmitEditing({ nativeEvent: { keyCode: 229 } });
  assert.equal(focused, false);
  field("Nombre").onSubmitEditing({ nativeEvent: {} });
  assert.equal(focused, true);
  const order = ["Nombre", "Apellido", "Legajo (solo numeros)", "DNI (sin puntos ni espacios)", "Email", "Contraseña", "Repetir contraseña", "Celular (solo numeros)", "Domicilio"];
  for (let index = 0; index < order.length - 1; index++) {
    let nextFocused = false;
    field(order[index + 1]).inputRef({ focus: () => { nextFocused = true; } });
    field(order[index]).onSubmitEditing({ nativeEvent: {} });
    assert.equal(nextFocused, true, `${order[index]} avanza a ${order[index + 1]}`);
  }
  if (os === "ios") {
    let addressFocused = false;
    field("Domicilio").inputRef({ focus: () => { addressFocused = true; } });
    field("Celular (solo numeros)").onFocus();
    render();
    const accessory = nodes().find((node) => node.type === "InputAccessoryView");
    assert.equal(field("Celular (solo numeros)").inputAccessoryViewID, accessory.props.nativeID);
    nodes().find((node) => node.props?.accessibilityLabel === "Siguiente campo").props.onPress();
    assert.equal(addressFocused, true);
  }
  field("Domicilio").onSubmitEditing({ nativeEvent: {} });
  render();
  assert.equal(nodes().find((node) => node.type === "Modal").props.visible, true);
  assert.equal(field("Domicilio").style.height, 144);
  assert.equal(field("Domicilio").multiline, true);
  assert.equal(field("Domicilio").submitBehavior, "submit");
  assert.equal(field("Contraseña").secureTextEntry, true);
  field("Contraseña").rightAccessory.props.onPress();
  render();
  assert.equal(field("Contraseña").secureTextEntry, false);
  assert.equal(field("Repetir contraseña").secureTextEntry, true);
  const values = {
    Nombre: "Ana", Apellido: "Perez", "Legajo (solo numeros)": "12345", "DNI (sin puntos ni espacios)": "32456789",
    Email: "ana@example.com", Contraseña: "Abc1234!", "Repetir contraseña": "different", "Celular (solo numeros)": "1155556666",
    Domicilio: "Calle de prueba 123, piso 2", "Fecha de nacimiento": "21091990",
  };
  for (const [label, value] of Object.entries(values)) field(label).onChangeText(value);
  nodes().find((node) => node.type === "FlatList").props.renderItem({ item: "Buenos Aires" }).props.onPress();
  render();
  assert.equal(field("Fecha de nacimiento").value, "21/09/1990");
  submit();
  assert.equal(submissions, 0);
  render();
  assert.equal(field("Repetir contraseña").error, "Las contraseñas no coinciden");
  field("Repetir contraseña").onChangeText("Abc1234!");
  render();
  assert.equal(field("Repetir contraseña").error, null);
  submit();
  assert.equal(submissions, 1);
  field("Contraseña").onChangeText("Other123!");
  render();
  submit();
  assert.equal(submissions, 1, "cambiar la original invalida la confirmación");
  state.cleanup();
});
}

test("InputWithError conserva props, referencia, altura y espacio del ojo", () => {
  const jsx = (type, props) => ({ type, props });
  const { InputWithError } = load("components/InputWithError.tsx", {
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "react-native": { View: "View", Text: "Text", TextInput: "TextInput" },
  });
  const ref = { current: null };
  const accessory = { type: "Pressable", props: {} };
  const tree = InputWithError({ label: "Contraseña", value: "value", onChangeText() {}, inputRef: ref, rightAccessory: accessory, secureTextEntry: false, style: { height: 144 } });
  const input = tree.props.children[1].props.children[0];
  assert.equal(input.props.ref, ref);
  assert.equal(input.props.accessibilityLabel, "Contraseña");
  assert.equal(input.props.secureTextEntry, false);
  assert.equal(input.props.style.height, 144);
  assert.ok(input.props.className.includes("pr-14"));
  assert.equal(tree.props.children[1].props.children[1].props.children, accessory);
});
