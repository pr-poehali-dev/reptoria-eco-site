import Icon from "@/components/ui/icon";
import { PRODUCTS } from "@/data/products";

interface CartItem {
  product: (typeof PRODUCTS)[0];
  qty: number;
}

type CheckoutStep = "cart" | "form" | "success";

interface CartDrawerProps {
  cart: CartItem[];
  cartOpen: boolean;
  checkoutStep: CheckoutStep;
  form: { name: string; phone: string; email: string; address: string; comment: string };
  totalItems: number;
  totalPrice: number;
  onClose: () => void;
  onSetCheckoutStep: (step: CheckoutStep) => void;
  onUpdateQty: (id: number, delta: number) => void;
  onRemoveFromCart: (id: number) => void;
  onFormChange: (field: string, value: string) => void;
  onOrder: (e: React.FormEvent) => void;
  onSuccessClose: () => void;
}

export default function CartDrawer({
  cart,
  cartOpen,
  checkoutStep,
  form,
  totalPrice,
  onClose,
  onSetCheckoutStep,
  onUpdateQty,
  onRemoveFromCart,
  onFormChange,
  onOrder,
  onSuccessClose,
}: CartDrawerProps) {
  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))] bg-[hsl(var(--sand))]">
          {checkoutStep === "cart" && (
            <>
              <h2 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">Корзина</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
              >
                <Icon name="X" size={18} className="text-[hsl(var(--muted-foreground))]" />
              </button>
            </>
          )}
          {checkoutStep === "form" && (
            <>
              <button
                onClick={() => onSetCheckoutStep("cart")}
                className="flex items-center gap-1 font-body text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <Icon name="ChevronLeft" size={16} />
                Назад
              </button>
              <h2 className="font-display text-2xl font-bold text-[hsl(var(--foreground))]">Оформление</h2>
              <button
                onClick={onClose}
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
                onClick={onClose}
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
                  <button onClick={onClose} className="mt-6 font-body text-sm text-[hsl(var(--moss))] hover:underline">
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
                            onClick={() => onUpdateQty(item.product.id, -1)}
                            className="w-6 h-6 rounded-full bg-white border border-[hsl(var(--border))] flex items-center justify-center hover:bg-[hsl(var(--muted))] transition-colors"
                          >
                            <Icon name="Minus" size={11} />
                          </button>
                          <span className="font-body text-sm font-semibold w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => onUpdateQty(item.product.id, 1)}
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
                            onClick={() => onRemoveFromCart(item.product.id)}
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
                {(() => {
                  const delivery = totalPrice > 3000 ? 0 : 350;
                  const grandTotal = totalPrice + delivery;
                  return (
                    <>
                      <div className="flex justify-between mb-2 font-body text-sm text-[hsl(var(--muted-foreground))]">
                        <span>Товары</span>
                        <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                      </div>
                      <div className="flex justify-between mb-3 font-body text-sm text-[hsl(var(--muted-foreground))]">
                        <span>Доставка</span>
                        <span className={delivery === 0 ? "text-[hsl(var(--moss))] font-semibold" : ""}>
                          {delivery === 0 ? "Бесплатно" : `${delivery} ₽`}
                        </span>
                      </div>
                      <div className="flex justify-between mb-5 font-display text-2xl font-bold text-[hsl(var(--foreground))] border-t border-[hsl(var(--border))] pt-3">
                        <span>Итого</span>
                        <span>{grandTotal.toLocaleString("ru-RU")} ₽</span>
                      </div>
                    </>
                  );
                })()}
                <button
                  onClick={() => onSetCheckoutStep("form")}
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
          <form onSubmit={onOrder} className="flex-1 flex flex-col">
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
                    onChange={(e) => onFormChange(field.key, e.target.value)}
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
                  onChange={(e) => onFormChange("comment", e.target.value)}
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
              onClick={onSuccessClose}
              className="bg-[hsl(var(--bark))] text-white font-body font-semibold px-8 py-3.5 rounded-full hover:bg-[hsl(var(--moss))] transition-all"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
