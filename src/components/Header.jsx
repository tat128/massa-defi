import { SunIcon, MoonIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header({ walletAddress = "0x12...abcd", balance = "₳ 1,234.56", onThemeToggle, darkMode }) {
  return (
    <header className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-gray-900 shadow rounded-b-lg">
      {/* Logo */}
      <span className="text-xl font-bold bg-gradient-to-r from-massa-blue to-blue-600 bg-clip-text text-transparent select-none">
        Massa DeFi
      </span>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Wallet Chip */}
      <div className="flex items-center gap-2 bg-massa-blue/10 px-3 py-1 rounded-full shadow text-xs font-mono text-massa-blue">
        <span className="rounded-full bg-massa-purple w-6 h-6 flex items-center justify-center text-white font-bold">M</span>
        {walletAddress}
        <span className="ml-2 font-semibold text-blue-600">{balance}</span>
      </div>
      {/* Notification Bell */}
      <button className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-massa-purple transition-colors">
        <BellIcon className="h-5 w-5 text-massa-blue dark:text-blue-600" />
      </button>
      {/* Theme Toggle */}
      <button
        className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-massa-purple transition-colors"
        onClick={onThemeToggle}
        aria-label="Toggle theme"
      >
        {darkMode ? (
          <SunIcon className="h-5 w-5 text-massa-blue dark:text-blue-600" />
        ) : (
          <MoonIcon className="h-5 w-5 text-massa-blue dark:text-blue-600" />
        )}
      </button>
      {/* Profile */}
      <button className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-massa-purple transition-colors">
        <UserCircleIcon className="h-5 w-5 text-massa-blue dark:text-blue-600" />
      </button>
    </header>
  );
}