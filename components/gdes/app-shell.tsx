interface AppShellProps {
  children: React.ReactNode
  showBottomTabs?: boolean
}

export function AppShell({ children, showBottomTabs = false }: AppShellProps) {
  return (
    <main className="h-screen bg-background flex items-center justify-center px-2 py-2 overflow-hidden">
      <div className="w-full max-w-[420px] h-full max-h-[900px]">
        <div className={`bg-card h-full rounded-[32px] shadow-lg flex flex-col overflow-hidden ${showBottomTabs ? '' : 'p-6 sm:p-8'}`}>
          {children}
        </div>
      </div>
    </main>
  )
}
