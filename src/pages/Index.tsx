import { useState } from "react";
import Icon from "@/components/ui/icon";

const GROUPS = [
  {
    id: "reptiles",
    title: "Кальций и витамины для рептилий",
    emoji: "🦎",
    products: [
      {
        id: 1,
        name: "Кальций РепТория без Д3",
        subtitle: "Без витамина D3",
        description: "Чистый карбонат кальция для укрепления костей и панциря. Идеален для бородатых агам и черепах.",
        price: 590,
        unit: "150 г",
        image: "https://cdn.poehali.dev/projects/50ec4a8f-91ec-444c-837d-30283d595bcd/bucket/f9a65db9-7ed3-4a4b-ae39-1e2147bd697d.png",
        badge: "Хит",
        badgeColor: "bg-[hsl(var(--moss))] text-[hsl(var(--primary-foreground))]",
        category: "Минералы",
      },
      {
        id: 2,
        name: "Кальций РепТория с Д3",
        subtitle: "Кальций+Д3",
        description: "Чистый карбонат кальция с витамином Д3 (130 000 МЕ/1кг). Рекомендован для черепах (сухопутных и водных, в т. ч. красноухих), хамелеонов, бородатых агам, эублефаров (леопардовых гекконов), фельзумов и других гекконов (напр., токи), игуан и других растительноядных ящериц, сцинков (в т. ч. синеязыких), варанов.",
        price: 550,
        unit: "100 г",
        image: "https://cdn.poehali.dev/projects/50ec4a8f-91ec-444c-837d-30283d595bcd/bucket/b97e4e85-6187-4c47-afcc-26745fd674d9.png",
        badge: "Новинка",
        badgeColor: "bg-[hsl(var(--earth))] text-white",
        category: "Витамины",
      },
      {
        id: 3,
        name: "МультиВит Рептил",
        subtitle: "Комплекс витаминов",
        description: "Полный витаминно-минеральный комплекс для всех видов рептилий. 12 витаминов + 8 минералов.",
        price: 1190,
        unit: "100 капсул",
        image: "https://cdn.poehali.dev/projects/50ec4a8f-91ec-444c-837d-30283d595bcd/files/68bfc352-33c2-423d-947f-0b20ba4a79fd.jpg",
        badge: null,
        badgeColor: "",
        category: "Комплексы",
      },
    ],
  },
  {
    id: "others",
    title: "Товары для других питомцев",
    emoji: "🐾",
    products: [
      {
        id: 4,
        name: "Кальций + D3",
        subtitle: "Для грызунов и кроликов",
        description: "Оптимальное сочетание кальция и D3 для максимального усвоения. Подходит для мелких млекопитающих.",
        price: 750,
        unit: "120 г",
        image: "https://cdn.poehali.dev/projects/50ec4a8f-91ec-444c-837d-30283d595bcd/files/d2e8a837-2df7-4a68-9a76-fadb6ff32b81.jpg",
        badge: null,
        badgeColor: "",
        category: "Минералы",
      },
      {
        id: 5,
        name: "Пробиотик Универсал",
        subtitle: "Здоровье кишечника",
        description: "Специализированный пробиотик для нормализации пищеварения после стресса или антибиотиков. Для всех питомцев.",
        price: 1350,
        unit: "60 капсул",
        image: "https://cdn.poehali.dev/projects/50ec4a8f-91ec-444c-837d-30283d595bcd/files/68bfc352-33c2-423d-947f-0b20ba4a79fd.jpg",
        badge: "Топ",
        badgeColor: "bg-[hsl(var(--leaf))] text-white",
        category: "Пробиотики",
      },
      {
        id: 6,
        name: "ВитаМинс Drops",
        subtitle: "Жидкий комплекс",
        description: "Жидкие витамины для удобного нанесения на корм. Быстрое усвоение, нейтральный вкус. Для птиц и грызунов.",
        price: 980,
        unit: "50 мл",
        image: "https://cdn.poehali.dev/projects/50ec4a8f-91ec-444c-837d-30283d595bcd/files/3e689652-ab18-4a3a-8208-95729f1afb34.jpg",
        badge: null,
        badgeColor: "",
        category: "Витамины",
      },
    ],
  },
];

const PRODUCTS = GROUPS.flatMap((g) => g.products);

interface CartItem {
  product: (typeof PRODUCTS)[0];
  qty: number;
}

type CheckoutStep = "cart" | "form" | "success";

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", comment: "" });
  const [addedId, setAddedId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const [modalQty, setModalQty] = useState(1);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = (product: (typeof PRODUCTS)[0]) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { product, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.product.id !== id));

  const updateQty = (id: number, delta: number) =>
    setCart((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)).filter((i) => i.qty > 0)
    );

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep("success");
  };

  const closeCart = () => {
    setCartOpen(false);
    setTimeout(() => setCheckoutStep("cart"), 300);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--sand))]">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-[hsl(var(--bark))] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--moss))] flex items-center justify-center">
              <span className="text-lg">🦎</span>
            </div>
            <div>
              <span className="font-display text-2xl font-bold tracking-wide text-white">РепТория</span>
              <p className="hidden sm:block text-[10px] uppercase tracking-widest text-white/50 font-body -mt-0.5">
                Добавки для рептилий
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 font-body text-sm text-white/70">
            <a href="#products" className="hover:text-white transition-colors">Каталог</a>
            <a href="#about" className="hover:text-white transition-colors">О нас</a>
            <a href="#delivery" className="hover:text-white transition-colors">Доставка</a>
          </nav>

          <button
            onClick={() => setCartOpen(true)}
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

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[hsl(var(--bark))] min-h-[520px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/50ec4a8f-91ec-444c-837d-30283d595bcd/files/34d95f24-8af8-49c2-85e7-715dd5001bfc.jpg)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--bark))] via-[hsl(var(--bark))]/80 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <p className="animate-fade-in-up font-body text-xs uppercase tracking-[0.25em] text-[hsl(var(--moss-light))] mb-4">
            Натуральный уход
          </p>
          <h1 className="animate-fade-in-up delay-100 font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
            Здоровье <br />
            <em className="text-[hsl(var(--moss-light))] not-italic">вашей рептилии</em>
            <br /> — наш приоритет
          </h1>
          <p className="animate-fade-in-up delay-200 font-body text-white/70 text-base sm:text-lg max-w-md mb-10 leading-relaxed">
            Витамины и минералы, разработанные специально для рептилий. Натуральные компоненты, точные дозировки, научная база.
          </p>
          <div className="animate-fade-in-up delay-300 flex flex-wrap gap-3">
            <a
              href="#products"
              className="bg-[hsl(var(--moss))] hover:bg-[hsl(var(--moss-light))] text-white font-body font-medium px-7 py-3.5 rounded-full transition-all hover:shadow-xl hover:shadow-[hsl(var(--moss))]/30 active:scale-95"
            >
              Смотреть каталог
            </a>
            <a
              href="#about"
              className="border border-white/30 text-white hover:bg-white/10 font-body font-medium px-7 py-3.5 rounded-full transition-all"
            >
              О нас
            </a>
          </div>
          <div className="animate-fade-in-up delay-400 flex gap-8 mt-12">
            {[
              ["500+", "довольных питомцев"],
              ["100%", "натуральный состав"],
              ["3 дня", "доставка по России"],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="font-display text-2xl font-bold text-white">{val}</div>
                <div className="font-body text-xs text-white/50 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section id="products" className="max-w-screen-xl mx-auto px-4 sm:px-6 py-14 space-y-14">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-6xl font-bold text-[hsl(var(--foreground))]">Все товары</h2>
          <span className="font-body text-sm text-[hsl(var(--muted-foreground))]">{PRODUCTS.length} товаров</span>
        </div>

        {GROUPS.map((group) => (
          <div key={group.id}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{group.emoji}</span>
              <h3 className="font-display text-4xl font-semibold text-[hsl(var(--foreground))]">{group.title}</h3>
              <div className="flex-1 h-px bg-[hsl(var(--border))] ml-2" />
              <span className="font-body text-xs text-[hsl(var(--muted-foreground))]">{group.products.length} товара</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {group.products.map((product, i) => (
            <div
              key={product.id}
              onClick={() => { setSelectedProduct(product); setModalQty(1); }}
              className="group bg-[hsl(var(--sand))] rounded-3xl overflow-hidden border border-transparent hover:border-[hsl(var(--moss-light))] hover:shadow-2xl transition-all duration-300 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="relative overflow-hidden h-72 bg-[hsl(var(--earth-light))]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className={`absolute top-4 left-4 text-sm font-body font-semibold px-3 py-1.5 rounded-full ${product.badgeColor}`}>
                    {product.badge}
                  </span>
                )}
                <span className="absolute top-4 right-4 bg-white/90 text-[hsl(var(--muted-foreground))] text-xs font-body px-3 py-1.5 rounded-full">
                  {product.category}
                </span>
              </div>

              <div className="p-6 bg-[hsl(var(--sand))]">
                <div className="mb-3">
                  <h3 className="font-display text-2xl font-semibold text-[hsl(var(--bark))] leading-tight">
                    {product.name}
                  </h3>
                  <p className="font-body text-sm text-[hsl(var(--moss-light))] font-medium mt-1">
                    {product.subtitle} · {product.unit}
                  </p>
                </div>
                <p className="font-body text-base text-[hsl(var(--earth))] leading-relaxed mb-6 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-bold text-[hsl(var(--foreground))]">
                    {product.price.toLocaleString("ru-RU")} ₽
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-body text-base font-medium transition-all active:scale-95 ${
                      addedId === product.id
                        ? "bg-[hsl(var(--moss))] text-white scale-95"
                        : "bg-[hsl(var(--bark))] text-white hover:bg-[hsl(var(--moss))] hover:shadow-lg"
                    }`}
                  >
                    {addedId === product.id ? (
                      <>
                        <Icon name="Check" size={14} />
                        Добавлено
                      </>
                    ) : (
                      <>
                        <Icon name="Plus" size={14} />
                        В корзину
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="bg-[hsl(var(--bark))] text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-[hsl(var(--moss-light))] mb-4">Наша история</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Создано владельцами рептилий
              </h2>
              <p className="font-body text-white/70 leading-relaxed mb-4">
                РепТория появилась из любви к рептилиям и разочарования в качестве существующих добавок. Мы, как заводчики, знаем, что нужно вашему питомцу.
              </p>
              <p className="font-body text-white/70 leading-relaxed">
                Каждый продукт разрабатывается совместно с ветеринарными герпетологами и проходит независимое лабораторное тестирование.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "FlaskConical", title: "Лабораторный контроль", text: "Каждая партия тестируется в независимой лаборатории" },
                { icon: "Leaf", title: "Натуральный состав", text: "Никаких искусственных красителей и консервантов" },
                { icon: "HeartHandshake", title: "Поддержка 24/7", text: "Консультируем по подбору добавок для вашего вида" },
                { icon: "Award", title: "Гарантия качества", text: "Возврат в течение 30 дней без вопросов" },
              ].map((item) => (
                <div key={item.title} className="bg-white/[0.08] rounded-xl p-4 border border-white/10">
                  <div className="w-9 h-9 bg-[hsl(var(--moss))]/40 rounded-lg flex items-center justify-center mb-3">
                    <Icon name={item.icon} fallback="CircleAlert" size={18} className="text-[hsl(var(--moss-light))]" />
                  </div>
                  <h4 className="font-body font-semibold text-sm mb-1 text-white">{item.title}</h4>
                  <p className="font-body text-xs text-white/50 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DELIVERY ── */}
      <section id="delivery" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-4xl font-bold text-center mb-10 text-[hsl(var(--foreground))]">Доставка и оплата</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: "Truck", title: "По России (СДЭК)", text: "2–5 дней · от 250 ₽\nПри заказе от 3000 ₽ — бесплатно" },
              { icon: "CreditCard", title: "Оплата", text: "Картой онлайн, СБП,\nналичными при получении" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--sand))]">
                <div className="w-10 h-10 bg-[hsl(var(--moss))]/15 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} fallback="CircleAlert" size={20} className="text-[hsl(var(--moss))]" />
                </div>
                <div>
                  <h4 className="font-body font-semibold text-[hsl(var(--foreground))] mb-1">{item.title}</h4>
                  <p className="font-body text-sm text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-line">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[hsl(var(--bark))] text-white/60 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦎</span>
            <span className="font-display text-xl font-bold text-white">РепТория</span>
          </div>
          <p className="font-body text-sm text-center">© 2026 РепТория · Добавки для рептилий</p>
          <div className="flex gap-4 font-body text-sm">
            <a href="#" className="hover:text-white transition-colors">Telegram</a>
            <a href="#" className="hover:text-white transition-colors">ВКонтакте</a>
          </div>
        </div>
      </footer>

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={closeCart} />
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))] bg-[hsl(var(--sand))]">
              {checkoutStep === "cart" && (
                <>
                  <h2 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">Корзина</h2>
                  <button
                    onClick={closeCart}
                    className="w-8 h-8 rounded-full hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                  >
                    <Icon name="X" size={18} className="text-[hsl(var(--muted-foreground))]" />
                  </button>
                </>
              )}
              {checkoutStep === "form" && (
                <>
                  <button
                    onClick={() => setCheckoutStep("cart")}
                    className="flex items-center gap-1 font-body text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  >
                    <Icon name="ChevronLeft" size={16} />
                    Назад
                  </button>
                  <h2 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">Оформление</h2>
                  <button
                    onClick={closeCart}
                    className="w-8 h-8 rounded-full hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                  >
                    <Icon name="X" size={18} className="text-[hsl(var(--muted-foreground))]" />
                  </button>
                </>
              )}
              {checkoutStep === "success" && (
                <>
                  <div />
                  <h2 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">Готово!</h2>
                  <button
                    onClick={closeCart}
                    className="w-8 h-8 rounded-full hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                  >
                    <Icon name="X" size={18} className="text-[hsl(var(--muted-foreground))]" />
                  </button>
                </>
              )}
            </div>

            {/* CART */}
            {checkoutStep === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                      <span className="text-5xl mb-4">🦎</span>
                      <p className="font-display text-xl font-semibold text-[hsl(var(--foreground))] mb-2">Корзина пуста</p>
                      <p className="font-body text-sm text-[hsl(var(--muted-foreground))]">Добавьте товары из каталога</p>
                      <button onClick={closeCart} className="mt-6 font-body text-sm text-[hsl(var(--moss))] hover:underline">
                        Перейти в каталог
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3 p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--sand))]"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body font-semibold text-sm text-[hsl(var(--foreground))] truncate">
                            {item.product.name}
                          </h4>
                          <p className="font-body text-xs text-[hsl(var(--muted-foreground))]">{item.product.unit}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQty(item.product.id, -1)}
                                className="w-6 h-6 rounded-full bg-white border border-[hsl(var(--border))] flex items-center justify-center hover:bg-[hsl(var(--muted))] transition-colors"
                              >
                                <Icon name="Minus" size={11} />
                              </button>
                              <span className="font-body text-sm font-semibold w-4 text-center">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.product.id, 1)}
                                className="w-6 h-6 rounded-full bg-[hsl(var(--bark))] text-white flex items-center justify-center hover:bg-[hsl(var(--moss))] transition-colors"
                              >
                                <Icon name="Plus" size={11} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-body font-semibold text-sm">
                                {(item.product.price * item.qty).toLocaleString("ru-RU")} ₽
                              </span>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors"
                              >
                                <Icon name="Trash2" size={13} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-5 border-t border-[hsl(var(--border))] bg-[hsl(var(--sand))]">
                    <div className="flex justify-between mb-2 font-body text-sm text-[hsl(var(--muted-foreground))]">
                      <span>Товаров: {totalItems}</span>
                      <span className="text-xs">Доставка рассчитается при оформлении</span>
                    </div>
                    <div className="flex justify-between mb-5 font-display text-2xl font-bold text-[hsl(var(--foreground))]">
                      <span>Итого</span>
                      <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                    </div>
                    <button
                      onClick={() => setCheckoutStep("form")}
                      className="w-full bg-[hsl(var(--moss))] hover:bg-[hsl(var(--moss-light))] text-white font-body font-semibold py-3.5 rounded-full transition-all hover:shadow-lg active:scale-[0.98]"
                    >
                      Оформить заказ
                    </button>
                  </div>
                )}
              </>
            )}

            {/* CHECKOUT FORM */}
            {checkoutStep === "form" && (
              <form onSubmit={handleOrder} className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="bg-[hsl(var(--sand))] rounded-xl p-3 mb-1">
                    <p className="font-body text-xs text-[hsl(var(--muted-foreground))]">Заказ на сумму</p>
                    <p className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">
                      {totalPrice.toLocaleString("ru-RU")} ₽
                    </p>
                  </div>

                  {[
                    { key: "name", label: "Ваше имя", placeholder: "Иван Иванов", type: "text", required: true },
                    { key: "phone", label: "Телефон", placeholder: "+7 (999) 000-00-00", type: "tel", required: true },
                    { key: "email", label: "Email", placeholder: "mail@example.com", type: "email", required: false },
                    { key: "address", label: "Адрес доставки", placeholder: "Город, улица, дом, квартира", type: "text", required: true },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="font-body text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider mb-1.5 block">
                        {field.label}{" "}
                        {field.required && <span className="text-[hsl(var(--moss))]">*</span>}
                      </label>
                      <input
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                        className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--moss))]/40 focus:border-[hsl(var(--moss-light))] transition-all"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="font-body text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider mb-1.5 block">
                      Комментарий к заказу
                    </label>
                    <textarea
                      placeholder="Пожелания по времени доставки..."
                      value={form.comment}
                      onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                      rows={3}
                      className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--moss))]/40 focus:border-[hsl(var(--moss-light))] transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="p-5 border-t border-[hsl(var(--border))] bg-[hsl(var(--sand))]">
                  <button
                    type="submit"
                    className="w-full bg-[hsl(var(--moss))] hover:bg-[hsl(var(--moss-light))] text-white font-body font-semibold py-3.5 rounded-full transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    Подтвердить заказ
                  </button>
                  <p className="font-body text-xs text-[hsl(var(--muted-foreground))] text-center mt-3 leading-relaxed">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              </form>
            )}

            {/* SUCCESS */}
            {checkoutStep === "success" && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-scale-in">
                <div className="w-20 h-20 bg-[hsl(var(--moss))]/15 rounded-full flex items-center justify-center mb-6">
                  <Icon name="CheckCircle" size={40} className="text-[hsl(var(--moss))]" />
                </div>
                <h3 className="font-display text-3xl font-bold text-[hsl(var(--foreground))] mb-3">Заказ принят!</h3>
                <p className="font-body text-[hsl(var(--muted-foreground))] mb-2 leading-relaxed">
                  Спасибо, {form.name || "дорогой покупатель"}! Мы свяжемся с вами в течение 30 минут для подтверждения заказа.
                </p>
                <p className="font-body text-sm text-[hsl(var(--moss-light))] mb-8">🦎 Ваши питомцы скажут спасибо!</p>
                <button
                  onClick={() => {
                    setCart([]);
                    setForm({ name: "", phone: "", email: "", address: "", comment: "" });
                    closeCart();
                  }}
                  className="bg-[hsl(var(--bark))] text-white font-body font-semibold px-8 py-3.5 rounded-full hover:bg-[hsl(var(--moss))] transition-all"
                >
                  Закрыть
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PRODUCT MODAL ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-scale-in">
            {/* Картинка без обрезания */}
            <div className="relative bg-[hsl(var(--sand))] rounded-t-3xl overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full object-contain max-h-72"
              />
              {selectedProduct.badge && (
                <span className={`absolute top-4 left-4 text-xs font-body font-semibold px-3 py-1.5 rounded-full ${selectedProduct.badgeColor}`}>
                  {selectedProduct.badge}
                </span>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-md"
              >
                <Icon name="X" size={18} className="text-[hsl(var(--foreground))]" />
              </button>
              <span className="absolute bottom-4 left-4 bg-white/90 text-[hsl(var(--muted-foreground))] text-xs font-body px-2.5 py-1 rounded-full">
                {selectedProduct.category}
              </span>
            </div>

            <div className="p-6">
              <div className="mb-3">
                <h2 className="font-display text-3xl font-bold text-[hsl(var(--foreground))] leading-tight">
                  {selectedProduct.name}
                </h2>
                <p className="font-body text-sm text-[hsl(var(--moss-light))] font-medium mt-1">
                  {selectedProduct.subtitle} · {selectedProduct.unit}
                </p>
              </div>

              <p className="font-body text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-body text-xs text-[hsl(var(--muted-foreground))] mb-1">Итого</p>
                  <span className="font-display text-3xl font-bold text-[hsl(var(--foreground))]">
                    {(selectedProduct.price * modalQty).toLocaleString("ru-RU")} ₽
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Количество */}
                  <div className="flex items-center gap-2 bg-[hsl(var(--sand))] rounded-full px-2 py-1.5">
                    <button
                      onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-full bg-white border border-[hsl(var(--border))] flex items-center justify-center hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      <Icon name="Minus" size={12} />
                    </button>
                    <span className="font-body font-semibold text-sm w-5 text-center">{modalQty}</span>
                    <button
                      onClick={() => setModalQty((q) => q + 1)}
                      className="w-7 h-7 rounded-full bg-[hsl(var(--bark))] text-white flex items-center justify-center hover:bg-[hsl(var(--moss))] transition-colors"
                    >
                      <Icon name="Plus" size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      for (let i = 0; i < modalQty; i++) addToCart(selectedProduct);
                      setModalQty(1);
                      setSelectedProduct(null);
                    }}
                    className="flex items-center gap-2 bg-[hsl(var(--moss))] hover:bg-[hsl(var(--moss-light))] text-white font-body font-semibold px-5 py-3 rounded-full transition-all hover:shadow-lg active:scale-95"
                  >
                    <Icon name="ShoppingBag" size={16} />
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}