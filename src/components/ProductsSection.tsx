import Icon from "@/components/ui/icon";
import { GROUPS, PRODUCTS } from "@/data/products";

interface ProductsSectionProps {
  addedId: number | null;
  onAddToCart: (product: (typeof PRODUCTS)[0]) => void;
  onProductClick: (product: (typeof PRODUCTS)[0]) => void;
}

export default function ProductsSection({ addedId, onAddToCart, onProductClick }: ProductsSectionProps) {
  return (
    <>
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
            <div className={`grid gap-6 ${group.id === "others" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {group.products.map((product, i) => (
                <div
                  key={product.id}
                  onClick={() => onProductClick(product)}
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
                      <div>
                        <span className="font-display text-3xl font-bold text-[hsl(var(--foreground))]">
                          {product.price.toLocaleString("ru-RU")} ₽
                        </span>
                        {"priceWholesale" in product && (
                          <p className="font-body text-xs text-[hsl(var(--moss))] font-medium mt-0.5">
                            {(product as { priceWholesale: number }).priceWholesale} ₽ · от 3 шт
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
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
              <p className="font-body text-white/70 leading-relaxed mb-8">
                Все продукты разрабатываются совместно с ветеринарными специалистами и проходят контроль качества.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "FlaskConical", text: "Научная формула" },
                  { icon: "Leaf", text: "Натуральный состав" },
                  { icon: "ShieldCheck", text: "Ветконтроль" },
                  { icon: "Heart", text: "С любовью к питомцам" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[hsl(var(--moss))]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} fallback="CircleAlert" size={16} className="text-[hsl(var(--moss-light))]" />
                    </div>
                    <span className="font-body text-sm text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/50ec4a8f-91ec-444c-837d-30283d595bcd/files/34d95f24-8af8-49c2-85e7-715dd5001bfc.jpg"
                  alt="О нас"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[hsl(var(--moss))] text-white rounded-2xl p-4 shadow-xl">
                <div className="font-display text-3xl font-bold">5+</div>
                <div className="font-body text-xs text-white/80">лет опыта</div>
              </div>
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
              { icon: "Truck", title: "По России (СДЭК)", text: "3–6 дней · от 350 ₽\nПри заказе от 3000 ₽ — бесплатно" },
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
    </>
  );
}
