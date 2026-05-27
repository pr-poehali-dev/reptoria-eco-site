import { useState } from "react";
import { PRODUCTS } from "@/data/products";
import Header from "@/components/Header";
import ProductsSection from "@/components/ProductsSection";
import CartDrawer from "@/components/CartDrawer";
import WholesaleModal from "@/components/WholesaleModal";

interface CartItem {
  product: (typeof PRODUCTS)[0];
  qty: number;
}

type CheckoutStep = "cart" | "form" | "success";

const SEND_ORDER_URL = "https://functions.poehali.dev/85bdf496-73ad-406c-ae30-9d970a15c06a";

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", comment: "" });
  const [addedId, setAddedId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [wholesaleOpen, setWholesaleOpen] = useState(false);
  const [wholesaleForm, setWholesaleForm] = useState({ name: "", phone: "", email: "", address: "", comment: "" });
  const [wholesaleStep, setWholesaleStep] = useState<"form" | "success">("form");
  const [wholesaleItems, setWholesaleItems] = useState<{ productId: number; qty: number }[]>([{ productId: PRODUCTS[0].id, qty: 1 }]);
  const [wholesalePayment, setWholesalePayment] = useState<"sbp" | "card" | "invoice" | "">("");

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

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const items = cart.map((i) => ({
      name: i.product.name,
      qty: i.qty,
      total: i.product.price * i.qty,
    }));
    await fetch(SEND_ORDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "order", ...form, items, total: totalPrice }),
    }).catch(() => {});
    setCheckoutStep("success");
  };

  const closeCart = () => {
    setCartOpen(false);
    setTimeout(() => setCheckoutStep("cart"), 300);
  };

  const handleWholesaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const items = wholesaleItems.map((wi) => {
      const p = PRODUCTS.find((p) => p.id === wi.productId);
      return { name: p?.name ?? "", qty: wi.qty };
    });
    await fetch(SEND_ORDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "wholesale", ...wholesaleForm, items, payment: wholesalePayment }),
    }).catch(() => {});
    setWholesaleStep("success");
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--sand))]">
      <Header
        totalItems={totalItems}
        onCartOpen={() => setCartOpen(true)}
      />

      <ProductsSection
        addedId={addedId}
        cart={cart}
        onAddToCart={addToCart}
        onUpdateQty={updateQty}
        onProductClick={(product) => { setSelectedProduct(product); setModalQty(1); }}
      />

      <CartDrawer
        cart={cart}
        cartOpen={cartOpen}
        checkoutStep={checkoutStep}
        form={form}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onClose={closeCart}
        onSetCheckoutStep={setCheckoutStep}
        onUpdateQty={updateQty}
        onRemoveFromCart={removeFromCart}
        onFormChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
        onOrder={handleOrder}
        onSuccessClose={() => {
          setCart([]);
          setForm({ name: "", phone: "", email: "", address: "", comment: "" });
          closeCart();
        }}
      />

      <WholesaleModal
        wholesaleOpen={wholesaleOpen}
        wholesaleStep={wholesaleStep}
        wholesaleForm={wholesaleForm}
        wholesaleItems={wholesaleItems}
        wholesalePayment={wholesalePayment}
        selectedProduct={selectedProduct}
        modalQty={modalQty}
        onWholesaleOpen={() => { setWholesaleOpen(true); setWholesaleStep("form"); }}
        onWholesaleClose={() => setWholesaleOpen(false)}
        onWholesaleFormChange={(field, value) => setWholesaleForm((f) => ({ ...f, [field]: value }))}
        onWholesaleItemsChange={setWholesaleItems}
        onWholesalePaymentChange={setWholesalePayment}
        onWholesaleSubmit={handleWholesaleSubmit}
        onWholesaleSuccessClose={() => {
          setWholesaleOpen(false);
          setWholesaleForm({ name: "", phone: "", email: "", address: "", comment: "" });
          setWholesaleItems([{ productId: PRODUCTS[0].id, qty: 1 }]);
          setWholesalePayment("");
        }}
        onProductClose={() => setSelectedProduct(null)}
        onModalQtyChange={setModalQty}
        onAddToCartFromModal={() => {
          for (let i = 0; i < modalQty; i++) addToCart(selectedProduct!);
          setModalQty(1);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}