import Icon from "@/components/ui/icon";

interface HeaderProps {
  totalItems: number;
  onCartOpen: () => void;
}

export default function Header({ totalItems, onCartOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--bark))] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--moss))] flex items-center justify-center">
            <span className="text-lg">🦎</span>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white leading-none">РепТория</h1>
            <p className="font-body text-xs text-white/50 leading-none mt-0.5">Добавки для рептилий</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 font-body text-sm text-white/70">
          <a href="#products" className="hover:text-white transition-colors">Каталог</a>
          <a href="#about" className="hover:text-white transition-colors">О нас</a>
          <a href="#delivery" className="hover:text-white transition-colors">Доставка</a>
        </nav>

        <button
          onClick={onCartOpen}
          className="relative flex items-center gap-2 bg-[hsl(var(--moss))] hover:bg-[hsl(var(--moss-light))] text-white font-body text-sm px-4 py-2 rounded-full transition-all hover:shadow-lg active:scale-95"
        >
          <Icon name="ShoppingBag" size={16} />
          <span className="hidden sm:inline">Корзина</span>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[hsl(var(--earth))] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
