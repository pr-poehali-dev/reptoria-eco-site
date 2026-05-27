import Icon from "@/components/ui/icon";
import { PRODUCTS } from "@/data/products";

interface WholesaleModalProps {
  wholesaleOpen: boolean;
  wholesaleStep: "form" | "success";
  wholesaleForm: { name: string; phone: string; email: string; address: string; comment: string };
  wholesaleItems: { productId: number; qty: number }[];
  wholesalePayment: "sbp" | "card" | "invoice" | "";
  selectedProduct: (typeof PRODUCTS)[0] | null;
  modalQty: number;
  onWholesaleOpen: () => void;
  onWholesaleClose: () => void;
  onWholesaleFormChange: (field: string, value: string) => void;
  onWholesaleItemsChange: (items: { productId: number; qty: number }[]) => void;
  onWholesalePaymentChange: (payment: "sbp" | "card" | "invoice") => void;
  onWholesaleSubmit: (e: React.FormEvent) => void;
  onWholesaleSuccessClose: () => void;
  onProductClose: () => void;
  onModalQtyChange: (qty: number) => void;
  onAddToCartFromModal: () => void;
}

export default function WholesaleModal({
  wholesaleOpen,
  wholesaleStep,
  wholesaleForm,
  wholesaleItems,
  wholesalePayment,
  selectedProduct,
  modalQty,
  onWholesaleOpen,
  onWholesaleClose,
  onWholesaleFormChange,
  onWholesaleItemsChange,
  onWholesalePaymentChange,
  onWholesaleSubmit,
  onWholesaleSuccessClose,
  onProductClose,
  onModalQtyChange,
  onAddToCartFromModal,
}: WholesaleModalProps) {
  return (
    <>
      {/* ── PRODUCT MODAL ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onProductClose}
          />
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-scale-in">
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
                onClick={onProductClose}
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

              {"priceWholesale" in selectedProduct && (
                <div className={`mb-4 px-4 py-2.5 rounded-xl text-sm font-body transition-all ${modalQty >= 3 ? "bg-[hsl(var(--moss))]/15 text-[hsl(var(--moss))]" : "bg-[hsl(var(--sand))] text-[hsl(var(--muted-foreground))]"}`}>
                  {modalQty >= 3
                    ? `🎉 Скидка применена — ${(selectedProduct as { priceWholesale: number }).priceWholesale} ₽/шт при покупке от 3 шт`
                    : `💡 Купите от 3 шт — цена ${(selectedProduct as { priceWholesale: number }).priceWholesale} ₽/шт`}
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-body text-xs text-[hsl(var(--muted-foreground))] mb-1">Итого</p>
                  <span className="font-display text-3xl font-bold text-[hsl(var(--foreground))]">
                    {(() => {
                      const pw = "priceWholesale" in selectedProduct ? (selectedProduct as { priceWholesale: number }).priceWholesale : null;
                      const unitPrice = pw && modalQty >= 3 ? pw : selectedProduct.price;
                      return (unitPrice * modalQty).toLocaleString("ru-RU");
                    })()} ₽
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[hsl(var(--sand))] rounded-full px-2 py-1.5">
                    <button
                      onClick={() => onModalQtyChange(Math.max(1, modalQty - 1))}
                      className="w-7 h-7 rounded-full bg-white border border-[hsl(var(--border))] flex items-center justify-center hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      <Icon name="Minus" size={12} />
                    </button>
                    <span className="font-body font-semibold text-sm w-5 text-center">{modalQty}</span>
                    <button
                      onClick={() => onModalQtyChange(modalQty + 1)}
                      className="w-7 h-7 rounded-full bg-[hsl(var(--bark))] text-white flex items-center justify-center hover:bg-[hsl(var(--moss))] transition-colors"
                    >
                      <Icon name="Plus" size={12} />
                    </button>
                  </div>

                  <button
                    onClick={onAddToCartFromModal}
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

      {/* ── FLOATING WHOLESALE BUTTON ── */}
      <button
        onClick={onWholesaleOpen}
        className="fixed bottom-6 right-6 z-40 bg-[hsl(var(--earth))] hover:bg-[hsl(var(--bark))] text-white font-body font-bold text-sm px-5 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <Icon name="Package" size={16} />
        ЗАКАЗАТЬ ОПТОМ
      </button>

      {/* ── WHOLESALE MODAL ── */}
      {wholesaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onWholesaleClose}
          />
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="bg-[hsl(var(--bark))] rounded-t-3xl px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Оптовый заказ</h2>
                <p className="font-body text-xs text-white/60 mt-0.5">Оставьте заявку — свяжемся в течение часа</p>
              </div>
              <button
                onClick={onWholesaleClose}
                className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
              >
                <Icon name="X" size={16} className="text-white" />
              </button>
            </div>

            {wholesaleStep === "form" ? (
              <form onSubmit={onWholesaleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                {[
                  { key: "name", label: "Ваше имя", placeholder: "Иван Иванов", type: "text", required: true },
                  { key: "phone", label: "Телефон", placeholder: "+7 (999) 000-00-00", type: "tel", required: true },
                  { key: "email", label: "Email", placeholder: "mail@example.com", type: "email", required: false },
                  { key: "address", label: "Адрес доставки", placeholder: "Город, улица, дом, квартира", type: "text", required: true },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="font-body text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider mb-1.5 block">
                      {field.label} {field.required && <span className="text-[hsl(var(--moss))]">*</span>}
                    </label>
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={wholesaleForm[field.key as keyof typeof wholesaleForm]}
                      onChange={(e) => onWholesaleFormChange(field.key, e.target.value)}
                      className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--moss))]/40 focus:border-[hsl(var(--moss-light))] transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="font-body text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider mb-2 block">
                    Состав заказа <span className="text-[hsl(var(--moss))]">*</span>
                  </label>
                  <div className="space-y-2">
                    {wholesaleItems.map((item, idx) => {
                      const selectedP = PRODUCTS.find((p) => p.id === item.productId) ?? PRODUCTS[0];
                      return (
                        <div key={idx} className="flex gap-2 items-center bg-[hsl(var(--sand))] rounded-xl p-2">
                          <img src={selectedP.image} alt={selectedP.name} className="w-10 h-10 rounded-lg object-contain bg-[hsl(var(--earth-light))] flex-shrink-0" />
                          <select
                            value={item.productId}
                            onChange={(e) => onWholesaleItemsChange(wholesaleItems.map((it, i) => i === idx ? { ...it, productId: Number(e.target.value) } : it))}
                            className="flex-1 border border-[hsl(var(--border))] rounded-lg px-2 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--moss))]/40 transition-all min-w-0"
                          >
                            {PRODUCTS.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                          <div className="flex items-center gap-1 bg-[hsl(var(--sand))] rounded-xl px-2 py-1.5">
                            <button type="button" onClick={() => onWholesaleItemsChange(wholesaleItems.map((it, i) => i === idx ? { ...it, qty: Math.max(1, it.qty - 1) } : it))}
                              className="w-6 h-6 rounded-full bg-white border border-[hsl(var(--border))] flex items-center justify-center hover:bg-[hsl(var(--muted))] transition-colors">
                              <Icon name="Minus" size={11} />
                            </button>
                            <span className="font-body text-sm font-semibold w-7 text-center">{item.qty}</span>
                            <button type="button" onClick={() => onWholesaleItemsChange(wholesaleItems.map((it, i) => i === idx ? { ...it, qty: it.qty + 1 } : it))}
                              className="w-6 h-6 rounded-full bg-[hsl(var(--bark))] text-white flex items-center justify-center hover:bg-[hsl(var(--moss))] transition-colors">
                              <Icon name="Plus" size={11} />
                            </button>
                          </div>
                          {wholesaleItems.length > 1 && (
                            <button type="button" onClick={() => onWholesaleItemsChange(wholesaleItems.filter((_, i) => i !== idx))}
                              className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0">
                              <Icon name="Trash2" size={13} className="text-red-400" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => onWholesaleItemsChange([...wholesaleItems, { productId: PRODUCTS[0].id, qty: 1 }])}
                    className="mt-2 flex items-center gap-1.5 font-body text-xs text-[hsl(var(--moss))] hover:text-[hsl(var(--moss-light))] transition-colors"
                  >
                    <Icon name="Plus" size={13} />
                    Добавить ещё товар
                  </button>
                </div>

                <div>
                  <label className="font-body text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider mb-2 block">
                    Предпочтительный способ оплаты <span className="text-[hsl(var(--moss))]">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "sbp", label: "СБП", icon: "Smartphone", desc: "Быстрый перевод по номеру телефона" },
                      { value: "card", label: "Перевод на карту", icon: "CreditCard", desc: "По реквизитам банковской карты" },
                      { value: "invoice", label: "Оплата по счёту", icon: "FileText", desc: "Выставим счёт для юридических лиц" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onWholesalePaymentChange(opt.value as "sbp" | "card" | "invoice")}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          wholesalePayment === opt.value
                            ? "border-[hsl(var(--moss))] bg-[hsl(var(--moss))]/8"
                            : "border-[hsl(var(--border))] hover:border-[hsl(var(--moss-light))]"
                        }`}
                      >
                        <Icon name={opt.icon} fallback="CircleAlert" size={18} className={wholesalePayment === opt.value ? "text-[hsl(var(--moss))]" : "text-[hsl(var(--muted-foreground))]"} />
                        <div>
                          <p className="font-body text-sm font-semibold text-[hsl(var(--foreground))]">{opt.label}</p>
                          <p className="font-body text-xs text-[hsl(var(--muted-foreground))]">{opt.desc}</p>
                        </div>
                        {wholesalePayment === opt.value && (
                          <Icon name="CheckCircle" size={16} className="text-[hsl(var(--moss))] ml-auto flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider mb-1.5 block">
                    Комментарий
                  </label>
                  <textarea
                    placeholder="Дополнительные пожелания..."
                    value={wholesaleForm.comment}
                    onChange={(e) => onWholesaleFormChange("comment", e.target.value)}
                    rows={2}
                    className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--moss))]/40 focus:border-[hsl(var(--moss-light))] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!wholesalePayment}
                  className="w-full bg-[hsl(var(--earth))] hover:bg-[hsl(var(--bark))] disabled:opacity-40 disabled:cursor-not-allowed text-white font-body font-bold py-3.5 rounded-full transition-all hover:shadow-lg active:scale-[0.98]"
                >
                  Отправить заявку
                </button>
                <p className="font-body text-xs text-[hsl(var(--muted-foreground))] text-center">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </form>
            ) : (
              <div className="p-8 flex flex-col items-center text-center animate-scale-in">
                <div className="w-16 h-16 bg-[hsl(var(--moss))]/15 rounded-full flex items-center justify-center mb-4">
                  <Icon name="CheckCircle" size={36} className="text-[hsl(var(--moss))]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[hsl(var(--foreground))] mb-2">Заявка отправлена!</h3>
                <p className="font-body text-sm text-[hsl(var(--muted-foreground))] mb-6 leading-relaxed">
                  Спасибо, {wholesaleForm.name || "друг"}! Мы свяжемся с вами в ближайшее время для обсуждения условий оптовой поставки.
                </p>
                <button
                  onClick={onWholesaleSuccessClose}
                  className="bg-[hsl(var(--bark))] text-white font-body font-semibold px-8 py-3 rounded-full hover:bg-[hsl(var(--moss))] transition-all"
                >
                  Закрыть
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
