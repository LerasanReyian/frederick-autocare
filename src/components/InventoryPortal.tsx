import { useEffect, useMemo, useRef, useState } from "react";

type IconName =
  | "archive"
  | "arrow-down"
  | "arrow-up"
  | "box"
  | "chevron"
  | "database"
  | "download"
  | "eye"
  | "eye-off"
  | "filter"
  | "grid"
  | "help"
  | "menu"
  | "more"
  | "overview"
  | "plus"
  | "refresh"
  | "logout"
  | "orders"
  | "settings"
  | "suppliers"
  | "edit"
  | "trash"
  | "search"
  | "x";

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    archive: <><path d="M4 7h16v13H4z" /><path d="M2.5 3.5h19v4h-19zM9 11h6" /></>,
    "arrow-down": <><path d="M12 5v14M18 13l-6 6-6-6" /></>,
    "arrow-up": <><path d="M12 19V5M6 11l6-6 6 6" /></>,
    box: <><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    "eye-off": <><path d="m3 3 18 18" /><path d="M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.8M6.7 6.7C4 8.2 2.5 12 2.5 12s3.5 6 9.5 6a10 10 0 0 0 3.2-.5" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
    filter: <><path d="M4 7h16M7 12h10M10 17h4" /><circle cx="8" cy="7" r="2" fill="currentColor" /><circle cx="15" cy="12" r="2" fill="currentColor" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    refresh: <><path d="M20 11a8 8 0 1 0 1 4" /><path d="M20 4v7h-7" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
    orders: <><path d="M3 7h12v11H3zM15 11h4l3 3v4h-7z" /><circle cx="7.5" cy="19" r="1.5" /><circle cx="18.5" cy="19" r="1.5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4L7.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" /></>,
    suppliers: <><path d="M3 20V8l9-5 9 5v12M7 20v-7h10v7" /><path d="M9 9h.01M15 9h.01M12 9h.01" /></>,
    edit: <><path d="m16 4 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    x: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

type Product = {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  threshold: number;
  price: number;
  color: string;
  symbol: string;
};

type Session = {
  name: string;
  email: string;
  role: "admin" | "employee";
};

type AccountRequest = {
  id: string;
  name: string;
  email: string;
  role: "employee";
  created_at: string;
};

type Booking = {
  id: string;
  customerName: string;
  phone: string;
  vehicle: string;
  service: string;
  appointment: string;
  notes: string | null;
  responseMessage: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
};

const bookingMessages = {
  pending: ["We are reviewing your request and will contact you shortly."],
  confirmed: ["Your appointment request has been approved. We look forward to seeing you.", "Your appointment is confirmed. Please contact us if you need to make changes."],
  cancelled: ["We are sorry, but we cannot accommodate this requested time. Please contact us so we can find another schedule.", "We apologize for the inconvenience. The shop is unavailable at this time; please choose another appointment time.", "We are unable to accept this request because of a scheduling conflict. We hope to serve you on another date."],
  completed: ["Thank you for choosing Frederick Car Accessories."],
};

const bookingStatusLabels: Record<Booking["status"], string> = {
  pending: "Pending review",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

function LoginView({ onLogin }: { onLogin: (session: Session) => void }) {
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await inventoryRequest<{ message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setRegistering(false);
      setPassword("");
      setError("");
      setSuccess(result.message);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit account request.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const session = await inventoryRequest<{ user: Session }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onLogin(session.user);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }

  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden bg-zinc-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-24 top-1/3 h-24 w-[34rem] -rotate-12 bg-red-600"></div>
        <div className="absolute -right-40 top-[44%] h-8 w-[34rem] -rotate-12 bg-white"></div>
        <div className="absolute -bottom-28 -left-20 size-80 rounded-full border-[3rem] border-red-600/20"></div>
        <div className="relative flex items-center gap-3">
          <div className="flex size-11 items-center justify-center bg-red-600 text-white"><Icon name="box" className="size-6" /></div>
          <div>
            <p className="text-xl font-black uppercase tracking-tight">Frederick Auto</p>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-zinc-500">Accessories & services</p>
          </div>
        </div>
        <div className="relative max-w-xl">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-red-500">Inventory control center</p>
          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-[-0.05em] xl:text-7xl">Built to keep<br /><span className="text-red-600">business moving.</span></h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-zinc-400">Manage every accessory, part, and service item behind the Frederick Auto promotional website.</p>
        </div>
        <div className="relative flex gap-10 border-t border-zinc-800 pt-6 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <span>Stock tracking</span><span>Team workflow</span><span>Local access</span>
        </div>
      </section>

      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center bg-red-600 text-white"><Icon name="box" /></div>
            <p className="text-lg font-black uppercase">Frederick Auto</p>
          </div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-red-600">Inventory access</p>
          <h2 className="text-4xl font-black uppercase tracking-tight">{registering ? "Request access" : "Welcome back"}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">{registering ? "Submit an employee account request. An Admin must approve it before you can sign in." : "Open the inventory dashboard, backed by the connected MariaDB database."}</p>

          <form className="mt-7 space-y-4" onSubmit={registering ? submitRegistration : submit}>
            {registering && <div><label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500" htmlFor="register-name">Full name</label><input id="register-name" type="text" required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-red-600" placeholder="Employee name" /></div>}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500" htmlFor="account-email">Email address</label>
              <input id="account-email" type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-red-600" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500" htmlFor="account-password">Password</label>
              <div className="relative">
                <input id="account-password" type={showPassword ? "text" : "password"} minLength={8} required autoComplete={registering ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 pr-12 text-sm outline-none focus:border-red-600" placeholder={registering ? "At least 8 characters" : "Enter your password"} />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-400 transition hover:text-zinc-700" aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"}>
                  <Icon name={showPassword ? "eye-off" : "eye"} className="size-5" />
                </button>
              </div>
            </div>
            {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
            {success && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">{success}</p>}
            <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Please wait..." : registering ? "Submit account request" : "Sign in to inventory"}<Icon name="chevron" className="size-4" />
            </button>
          </form>
          <button type="button" onClick={() => { setRegistering((value) => !value); setError(""); setSuccess(""); }} className="mt-4 w-full text-center text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700">
            {registering ? "Already have an account? Sign in" : "Need access? Request an employee account"}
          </button>

          <div className="mt-7 flex items-center justify-between border-t border-zinc-100 pt-5 text-xs text-zinc-400">
            <span>MySQL inventory</span>
            <a href="/" className="font-bold text-zinc-700 hover:text-red-600">Back to website</a>
          </div>
        </div>
      </main>
    </div>
  );
}

async function inventoryRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  const response = await fetch(`${baseUrl}/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  let result: ({ error?: string } & T);
  try {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error(`The inventory API at ${baseUrl || "the Vite proxy"} returned a non-JSON response. Restart the current backend server.`);
    }
    result = await response.json();
  } catch {
    throw new Error(`The inventory API at ${baseUrl || "the Vite proxy"} returned an invalid response. Restart the current backend server.`);
  }
  if (!response.ok) throw new Error(result.error || `Inventory request failed (${response.status}).`);
  return result;
}

function Button({ children, variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const styles = {
    primary: "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-200",
    secondary: "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
    ghost: "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
  };
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

function InventoryDashboard({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const isAdmin = session.role === "admin";
  const canAddProducts = isAdmin || session.role === "employee";
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [apiError, setApiError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All items");
  const [stockFilter, setStockFilter] = useState("All stock");
  const [mobileNav, setMobileNav] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [compactRows, setCompactRows] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("Inventory");
  const [page, setPage] = useState(0);
  const [accountRequests, setAccountRequests] = useState<AccountRequest[]>([]);
  const [requestsError, setRequestsError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsError, setBookingsError] = useState("");
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsRefreshedAt, setBookingsRefreshedAt] = useState("");
  const [updatingBookingId, setUpdatingBookingId] = useState("");
  const [exportMessage, setExportMessage] = useState("");
  const [exportError, setExportError] = useState("");
  const productNameInput = useRef<HTMLInputElement>(null);
  const pageSize = 8;

  const filtered = useMemo(() => products.filter((product) => {
    const matchesSearch = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCategory = category === "All items" || product.category === category;
    const status = product.stock === 0 ? "Out of stock" : product.stock <= product.threshold ? "Low stock" : "In stock";
    const matchesStock = stockFilter === "All stock" || status === stockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  }), [products, query, category, stockFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageProducts = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const selectedProducts = products.filter((product) => selectedIds.includes(product.id));
  const allPageSelected = pageProducts.length > 0 && pageProducts.every((product) => selectedIds.includes(product.id));
  const lowStock = products.filter((item) => item.stock > 0 && item.stock <= item.threshold).length;
  const outOfStock = products.filter((item) => item.stock === 0).length;
  const inventoryValue = products.reduce((total, item) => total + item.stock * item.price, 0);

  useEffect(() => {
    setPage(0);
  }, [query, category, stockFilter]);

  useEffect(() => {
    if (page >= pageCount) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  useEffect(() => {
    setSelectedIds((ids) => ids.filter((id) => products.some((product) => product.id === id)));
  }, [products]);

  useEffect(() => {
    let active = true;
    inventoryRequest<Product[]>("/products")
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((error: unknown) => {
        if (active) setApiError(error instanceof Error ? error.message : "Unable to load inventory from MySQL.");
      })
      .finally(() => {
        if (active) setLoadingProducts(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    inventoryRequest<AccountRequest[]>("/auth/requests")
      .then(setAccountRequests)
      .catch((error) => setRequestsError(error instanceof Error ? error.message : "Unable to load account requests."));
  }, [isAdmin, activeSection]);

  useEffect(() => {
    if (activeSection !== "Bookings") return;
    setLoadingBookings(true);
    inventoryRequest<Booking[]>("/bookings")
      .then((items) => {
        setBookings(items);
        setBookingsRefreshedAt(new Date().toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" }));
      })
      .catch((error) => setBookingsError(error instanceof Error ? error.message : "Unable to load bookings."))
      .finally(() => setLoadingBookings(false));
  }, [activeSection, isAdmin]);

  async function refreshBookings() {
    setLoadingBookings(true);
    setBookingsError("");
    try {
      const items = await inventoryRequest<Booking[]>("/bookings");
      setBookings(items);
      setBookingsRefreshedAt(new Date().toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" }));
    } catch (error) {
      setBookingsError(error instanceof Error ? error.message : "Unable to refresh bookings.");
    } finally {
      setLoadingBookings(false);
    }
  }

  async function reviewAccountRequest(request: AccountRequest, action: "approve" | "reject") {
    try {
      await inventoryRequest(`/auth/requests/${request.id}/${action}`, { method: "POST" });
      setAccountRequests((items) => items.filter((item) => item.id !== request.id));
    } catch (error) {
      setRequestsError(error instanceof Error ? error.message : "Unable to review account request.");
    }

  }

  async function updateBookingStatus(booking: Booking, status: Booking["status"], responseMessage: string) {
    if (status !== booking.status && (status === "cancelled" || status === "completed") && !window.confirm(`Mark this booking as ${bookingStatusLabels[status].toLowerCase()}?`)) return;
    setUpdatingBookingId(booking.id);
    setBookingsError("");
    try {
      await inventoryRequest(`/bookings/${booking.id}/status`, { method: "PUT", body: JSON.stringify({ status, responseMessage }) });
      setBookings((items) => items.map((item) => item.id === booking.id ? { ...item, status, responseMessage } : item));
    } catch (error) {
      setBookingsError(error instanceof Error ? error.message : "Unable to update booking.");
    } finally {
      setUpdatingBookingId("");
    }
  }

  useEffect(() => {
    if (!showAdd) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeProductForm();
    }

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);
    productNameInput.current?.focus();
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAdd]);

  useEffect(() => {
    if (!mobileNav) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileNav(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileNav]);

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    const sku = String(form.get("sku")).trim();
    const duplicateSku = products.some((product) => (
      product.sku.toLowerCase() === sku.toLowerCase() && product.id !== editingProduct?.id
    ));
    if (duplicateSku) {
      setFormError("That SKU is already in use. Enter a unique SKU.");
      return;
    }

    const nextProduct = {
      name,
      category: String(form.get("category")),
      sku,
      stock: Number(form.get("stock")),
      threshold: form.get("threshold") === null || form.get("threshold") === ""
        ? editingProduct?.threshold ?? 10
        : Number(form.get("threshold")),
      price: Number(form.get("price")),
      color: editingProduct?.color ?? "bg-violet-100 text-violet-700",
    };
    try {
      const savedProduct = await inventoryRequest<Product>(
        editingProduct ? `/products/${editingProduct.id}` : "/products",
        { method: editingProduct ? "PUT" : "POST", body: JSON.stringify(nextProduct) },
      );
      setProducts((items) => editingProduct
        ? items.map((item) => item.id === editingProduct.id ? savedProduct : item)
        : [savedProduct, ...items]);
      setApiError("");
      setFormError("");
      setEditingProduct(null);
      setShowAdd(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save product to MySQL.");
    }
  }

  function openAddProduct() {
    setEditingProduct(null);
    setFormError("");
    setShowAdd(true);
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product);
    setFormError("");
    setShowAdd(true);
  }

  function closeProductForm() {
    setShowAdd(false);
    setEditingProduct(null);
    setFormError("");
  }

  async function restockProduct(product: Product) {
    try {
      const updated = await inventoryRequest<Product>(`/products/${product.id}/restock`, {
        method: "POST",
        body: JSON.stringify({ quantity: 25 }),
      });
      setProducts((items) => items.map((item) => item.id === product.id ? updated : item));
      setApiError("");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to update stock in MySQL.");
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name} from inventory? This cannot be undone.`)) return;
    try {
      await inventoryRequest<{ deleted: number }>(`/products/${product.id}`, { method: "DELETE" });
      setProducts((items) => items.filter((item) => item.id !== product.id));
      setApiError("");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to delete product from MySQL.");
    }
  }

  function togglePageSelection() {
    const pageIds = pageProducts.map((product) => product.id);
    setSelectedIds((ids) => allPageSelected
      ? ids.filter((id) => !pageIds.includes(id))
      : [...new Set([...ids, ...pageIds])]);
  }

  function exportInventory(items = filtered) {
    if (items.length === 0) {
      setExportError("There are no inventory items to export. Adjust the search or filters and try again.");
      window.setTimeout(() => setExportError(""), 4000);
      return;
    }

    const escapeCsv = (value: string | number) => {
      const text = String(value);
      const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${safeText.replaceAll('"', '""')}"`;
    };
    const rows = [
      ["Product", "SKU", "Category", "Stock", "Threshold", "Stock status", "Unit price (PHP)", "Inventory value (PHP)"],
      ...items.map((product) => [
        product.name,
        product.sku,
        product.category,
        product.stock,
        product.threshold,
        product.stock === 0 ? "Out of stock" : product.stock <= product.threshold ? "Low stock" : "In stock",
        product.price.toFixed(2),
        (product.stock * product.price).toFixed(2),
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    const scope = items === selectedProducts ? "selected" : "filtered";
    const date = new Date().toISOString().slice(0, 10);
    link.download = `frederick-car-accessories-inventory-${scope}-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExportError("");
    setExportMessage(`Exported ${items.length} inventory item${items.length === 1 ? "" : "s"} as CSV.`);
    window.setTimeout(() => setExportMessage(""), 4000);
  }

  async function deleteSelected() {
    if (!window.confirm(`Delete ${selectedProducts.length} selected product${selectedProducts.length === 1 ? "" : "s"}? This cannot be undone.`)) return;
    try {
      await inventoryRequest<{ deleted: number }>("/products/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ ids: selectedIds }),
      });
      setProducts((items) => items.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      setApiError("");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to delete selected products from MySQL.");
    }
  }

  const categories = [...new Set(products.map((product) => product.category))].sort();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex min-h-screen">
        {mobileNav && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-zinc-950/45 lg:hidden"
            aria-label="Close navigation"
            onClick={() => setMobileNav(false)}
          />
        )}
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-5 text-white transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-9 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center bg-red-600 text-white"><Icon name="box" className="size-5" /></div>
              <div><span className="block text-sm font-black uppercase tracking-wide">Frederick Auto</span><span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-zinc-500">Control center</span></div>
            </div>
            <button className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"><Icon name="x" /></button>
          </div>

          <nav className="space-y-1" aria-label="Inventory navigation">
            <p className="mb-3 px-3 pt-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-zinc-600">Workspace</p>
            {[
              { name: "Overview", icon: "overview" as IconName },
              { name: "Inventory", icon: "database" as IconName },
              { name: "Bookings", icon: "orders" as IconName },
              ...(isAdmin ? [{ name: "Account requests", icon: "settings" as IconName }] : []),
            ].map((item) => (
              <button
                key={item.name}
                type="button"
                aria-current={activeSection === item.name ? "page" : undefined}
                onClick={() => { setActiveSection(item.name); setMobileNav(false); }}
                className={`flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left text-sm font-bold transition-colors ${activeSection === item.name ? "border-red-600 bg-red-600/10 text-white" : "border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"}`}
              >
                <Icon name={item.icon} className="size-5" />
                <span>{item.name}</span>
                {item.name === "Account requests" && accountRequests.length > 0 && <span className="ml-auto rounded-full bg-red-600 px-2 py-0.5 text-[0.6rem] text-white">{accountRequests.length}</span>}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="mb-4 border border-zinc-800 bg-zinc-900 p-4 text-white">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-red-500">MariaDB database</p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">Inventory records are stored in the connected database. The public catalog is separate.</p>
              <a href="/" className="mt-3 inline-flex text-xs font-bold text-white hover:text-red-400">View public website <span className="ml-1" aria-hidden="true">→</span></a>
            </div>
            <div className="flex items-center gap-3 border-t border-zinc-800 pt-4">
              <div className="flex size-9 items-center justify-center bg-red-600 text-sm font-black text-white">{session.name.slice(0, 2).toUpperCase()}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold capitalize">{session.name}</p>
                <p className="truncate text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">{session.role} account</p>
              </div>
              <button onClick={onLogout} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white" aria-label="Sign out" title="Sign out"><Icon name="logout" /></button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 lg:ml-64">
          <header className="flex h-20 items-center justify-between border-b border-zinc-200 bg-white px-5 md:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-600 lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation" aria-expanded={mobileNav}><Icon name="menu" /></button>
              <div>
                <p className="text-xs font-medium text-zinc-400">Catalog / <span className="text-zinc-700">{activeSection}</span></p>
                <p className="mt-0.5 text-sm font-semibold md:hidden">{activeSection}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" aria-label="View storefront" title="View storefront" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2.5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 sm:px-4">
                <Icon name="grid" className="size-4" /><span className="hidden sm:inline">View storefront</span>
              </a>
              <Button variant="secondary" onClick={() => exportInventory()} aria-label="Export inventory"><Icon name="download" className="size-4" /><span className="hidden sm:inline">Export</span></Button>
              {canAddProducts && <Button onClick={openAddProduct}><Icon name="plus" className="size-4" /><span className="hidden sm:inline">Add product</span><span className="sm:hidden">Add</span></Button>}
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-5 md:p-8 lg:p-10">
            {exportMessage && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">{exportMessage}</p>}
            {exportError && <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800" role="alert">{exportError}</p>}
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-red-600">MariaDB inventory / Shared database</p>
                <h1 className="text-3xl font-black uppercase tracking-tight md:text-4xl">{activeSection === "Overview" ? "Inventory overview" : activeSection === "Inventory" ? "Car accessories inventory" : activeSection}</h1>
                <p className="mt-2 text-sm text-zinc-500">Track products, parts, and shop supplies in one place.</p>
              </div>
              <p className={`rounded-full border bg-white px-3 py-1.5 text-xs font-medium ${apiError ? "border-rose-200 text-rose-600" : "border-zinc-200 text-zinc-500"}`}>
                <span className={`mr-2 inline-block size-2 rounded-full ${apiError ? "bg-rose-500" : "bg-emerald-500"}`}></span>{loadingProducts ? "Connecting to MySQL" : apiError ? "Database unavailable" : "MySQL database"}
              </p>
            </div>

            {apiError && (
              <div className="mx-auto mt-5 flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
                <span>{apiError}</span>
                <button type="button" onClick={() => window.location.reload()} className="font-bold underline underline-offset-2">Retry connection</button>
              </div>
            )}

            {!loadingProducts && !apiError && <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Inventory summary">
              {[
                { label: "Total products", value: products.length.toLocaleString(), icon: "box" as IconName, note: "Tracked catalog items", direction: "neutral" },
                { label: "Inventory value", value: `₱${inventoryValue.toLocaleString()}`, icon: "database" as IconName, note: "Current stock value", direction: "neutral" },
                { label: "Low stock", value: lowStock, icon: "arrow-down" as IconName, note: "Needs attention", direction: "down" },
                { label: "Out of stock", value: outOfStock, icon: "archive" as IconName, note: "Restock required", direction: "neutral" },
              ].map((stat) => (
                <article key={stat.label} className="relative overflow-hidden border border-zinc-200 border-t-4 border-t-red-600 bg-white p-5 shadow-sm shadow-zinc-200/30">
                  <div className="mb-5 flex items-start justify-between">
                    <span className="text-sm font-medium text-zinc-500">{stat.label}</span>
                    <span className={`flex size-9 items-center justify-center ${stat.direction === "down" ? "bg-amber-50 text-amber-600" : "bg-zinc-950 text-white"}`}><Icon name={stat.icon} className="size-4" /></span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${stat.direction === "up" ? "text-emerald-600" : "text-zinc-400"}`}>
                    {stat.direction === "up" && <Icon name="arrow-up" className="size-3" />}{stat.note}
                  </p>
                </article>
              ))}
            </section>}

            {activeSection === "Bookings" && (
              <section className="border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Customer requests</p>
                    <h2 className="mt-2 text-xl font-bold">Service bookings</h2>
                    <p className="mt-2 text-sm text-zinc-500">Review appointment requests submitted from the public website.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {bookingsRefreshedAt && <span className="text-xs text-zinc-400">Updated {bookingsRefreshedAt}</span>}
                    <Button variant="secondary" onClick={refreshBookings} disabled={loadingBookings}>
                      <Icon name="refresh" className={`size-4 ${loadingBookings ? "animate-spin" : ""}`} />
                      {loadingBookings ? "Refreshing" : "Refresh"}
                    </Button>
                  </div>
                </div>
                {bookingsError && <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{bookingsError}</p>}
                <div className="mt-6 divide-y divide-zinc-100">
                  {loadingBookings && bookings.length === 0 && <p className="py-8 text-sm text-zinc-500">Loading booking requests...</p>}
                  {!loadingBookings && bookings.length === 0 && <p className="py-8 text-sm text-zinc-500">No booking requests yet. New customer requests will appear here after you refresh.</p>}
                  {bookings.map((booking) => (
                    <article key={booking.id} className="booking-admin-card grid gap-5 py-6">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3"><div><span className="booking-detail-label">Customer name</span><p className="text-base font-bold text-zinc-900">{booking.customerName}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${booking.status === "pending" ? "bg-amber-100 text-amber-700" : booking.status === "confirmed" ? "bg-blue-100 text-blue-700" : booking.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{bookingStatusLabels[booking.status]}</span></div>
                        <div className="booking-detail-grid mt-4">
                          <div><span className="booking-detail-label">Phone number</span><p className="booking-detail-value">{booking.phone}</p></div>
                          <div><span className="booking-detail-label">Vehicle unit and model</span><p className="booking-detail-value">{booking.vehicle}</p></div>
                          <div><span className="booking-detail-label">Preferred service</span><p className="booking-detail-value">{booking.service}</p></div>
                          <div><span className="booking-detail-label">Requested appointment</span><p className="booking-detail-value">{new Date(booking.appointment).toLocaleString("en-PH", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Manila" })}</p></div>
                        </div>
                        {booking.notes && <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-2 text-sm leading-relaxed text-zinc-700"><span className="booking-detail-label">Special notes or vehicle concerns</span><span className="mt-1 block">{booking.notes}</span></p>}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-zinc-500" htmlFor={`booking-status-${booking.id}`}>Booking status
                          <select id={`booking-status-${booking.id}`} disabled={updatingBookingId === booking.id} value={booking.status} onChange={(event) => { const nextStatus = event.target.value as Booking["status"]; updateBookingStatus(booking, nextStatus, bookingMessages[nextStatus][0]); }} className="min-h-11 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold normal-case tracking-normal text-zinc-800 shadow-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100">
                          <option value="pending">Pending</option><option value="confirmed">Approved / confirmed</option><option value="completed">Completed</option><option value="cancelled">Rejected / cancelled</option>
                          </select>
                        </label>
                        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-zinc-500" htmlFor={`booking-message-${booking.id}`}>Customer response
                          <select id={`booking-message-${booking.id}`} disabled={updatingBookingId === booking.id} value={bookingMessages[booking.status].includes(booking.responseMessage ?? "") ? booking.responseMessage ?? "" : bookingMessages[booking.status][0]} onChange={(event) => updateBookingStatus(booking, booking.status, event.target.value)} className="min-h-11 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-zinc-800 shadow-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100">
                          {bookingMessages[booking.status].map((message) => <option key={message} value={message}>{message}</option>)}
                          </select>
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "Account requests" && isAdmin && (
              <section className="border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Admin approval</p>
                <h2 className="mt-2 text-xl font-bold">Employee account requests</h2>
                <p className="mt-2 text-sm text-zinc-500">Approve requests to create employee accounts that can sign in and restock inventory.</p>
                {requestsError && <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{requestsError}</p>}
                <div className="mt-6 divide-y divide-zinc-100">
                  {accountRequests.length === 0 && <p className="py-8 text-sm text-zinc-500">No pending account requests.</p>}
                  {accountRequests.map((request) => (
                    <div key={request.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div><p className="font-semibold">{request.name}</p><p className="text-sm text-zinc-500">{request.email} · Employee</p></div>
                      <div className="flex gap-2"><Button variant="secondary" onClick={() => reviewAccountRequest(request, "reject")}>Reject</Button><Button onClick={() => reviewAccountRequest(request, "approve")}>Approve</Button></div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection !== "Inventory" && activeSection !== "Overview" && activeSection !== "Account requests" && activeSection !== "Bookings" && (
              <section className="border border-zinc-200 bg-white p-8 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">{activeSection}</p>
                <h2 className="mt-2 text-xl font-bold">{activeSection} are not part of this local demo</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">The MySQL integration currently stores inventory items only. No {activeSection.toLowerCase()} data is connected.</p>
                <Button className="mt-5" onClick={() => setActiveSection("Inventory")}>Back to inventory</Button>
              </section>
            )}

            {activeSection === "Inventory" && (
              <section className="overflow-hidden border border-zinc-200 bg-white shadow-sm shadow-zinc-200/30">
                <div className="border-b-4 border-red-600 bg-zinc-950 p-5 text-white">
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <h2 className="font-bold">Accessories and parts</h2>
                      <p className="mt-1 text-xs text-zinc-500">{filtered.length} products in this view</p>
                    </div>
                    <div className="relative">
                      <button type="button" onClick={() => setSettingsOpen((open) => !open)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Inventory display settings" aria-expanded={settingsOpen} title="Display settings"><Icon name="settings" /></button>
                      {settingsOpen && <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-zinc-200 bg-white p-3 text-zinc-800 shadow-xl"><label className="flex cursor-pointer items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={compactRows} onChange={(event) => setCompactRows(event.target.checked)} /> Compact table rows</label></div>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 xl:flex-row">
                    <label className="relative min-w-48 flex-1">
                      <span className="sr-only">Search inventory</span>
                      <Icon name="search" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search accessories or SKU..." className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-600" />
                    </label>
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 xl:pb-0">
                        {["All items", ...["Lighting", "Interior", "Electronics", "Car Care"].filter((item) => categories.includes(item))].map((item) => (
                          <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-lg px-3.5 py-2.5 text-xs font-bold transition ${category === item ? "bg-red-600 text-white" : "border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"}`}>{item}</button>
                        ))}
                      </div>
                      <div className="relative">
                        <button type="button" onClick={() => setFiltersOpen((open) => !open)} className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-100" aria-expanded={filtersOpen}><Icon name="filter" className="size-4" />Filters</button>
                        {filtersOpen && <div className="absolute right-0 top-12 z-20 grid w-64 gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-800 shadow-xl">
                          <label className="grid gap-1.5 text-xs font-semibold">Category
                            <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-normal">
                              {["All items", ...categories].map((item) => <option key={item}>{item}</option>)}
                            </select>
                          </label>
                          <label className="grid gap-1.5 text-xs font-semibold">Stock status
                            <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-normal">
                              {["All stock", "In stock", "Low stock", "Out of stock"].map((item) => <option key={item}>{item}</option>)}
                            </select>
                          </label>
                          <button type="button" onClick={() => { setCategory("All items"); setStockFilter("All stock"); }} className="justify-self-start text-xs font-bold text-red-600 hover:text-red-700">Clear filters</button>
                        </div>}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedIds.length > 0 && <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-red-50 px-5 py-3">
                  <p className="text-sm font-semibold text-zinc-800">{selectedIds.length} selected</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => exportInventory(selectedProducts)}><Icon name="download" className="size-4" />Export selected</Button>
                    {isAdmin && <Button variant="secondary" className="text-rose-600" onClick={deleteSelected}><Icon name="trash" className="size-4" />Delete selected</Button>}
                    <Button variant="ghost" onClick={() => setSelectedIds([])}>Clear</Button>
                  </div>
                </div>}

                {loadingProducts && <div className="px-5 py-14 text-center text-sm text-zinc-500">Loading inventory from MySQL...</div>}

                {!loadingProducts && !apiError && (
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-100 text-xs font-black uppercase tracking-wider text-zinc-500">
                        <th className="w-14 px-5 py-4"><input type="checkbox" aria-label="Select all products on this page" checked={allPageSelected} onChange={togglePageSelection} /></th>
                        <th className="px-3 py-4">Product</th>
                        <th className="px-3 py-4">Category</th>
                        <th className="px-3 py-4">Stock</th>
                        <th className="px-3 py-4">Price</th>
                        <th className="px-5 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {pageProducts.map((product) => {
                        const status = product.stock === 0 ? "Out of stock" : product.stock <= product.threshold ? "Low stock" : "In stock";
                        return (
                          <tr key={product.id} className={`group hover:bg-zinc-50/70 ${selectedIds.includes(product.id) ? "bg-red-50/50" : ""}`}>
                            <td className="px-5 py-3"><input type="checkbox" aria-label={`Select ${product.name}`} checked={selectedIds.includes(product.id)} onChange={() => setSelectedIds((ids) => ids.includes(product.id) ? ids.filter((id) => id !== product.id) : [...ids, product.id])} /></td>
                            <td className={compactRows ? "px-3 py-2" : "px-3 py-4"}>
                              <div className="flex items-center gap-3">
                                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${product.color}`}>{product.symbol}</div>
                                <div className="min-w-0"><p className="truncate text-sm font-semibold">{product.name}</p><p className="mt-1 text-xs text-zinc-400">{product.sku}</p></div>
                              </div>
                            </td>
                            <td className="px-3 py-4 text-sm text-zinc-500">{product.category}</td>
                            <td className="px-3 py-4">
                              <p className="text-sm font-semibold">{product.stock} <span className="font-normal text-zinc-400">units</span></p>
                              <span className={`mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium ${status === "In stock" ? "text-emerald-600" : status === "Low stock" ? "text-amber-600" : "text-rose-600"}`}><span className="size-1.5 rounded-full bg-current"></span>{status}</span>
                            </td>
                            <td className="px-3 py-4 text-sm font-semibold">₱{product.price.toLocaleString()}</td>
                            <td className="px-5 py-4 text-right">
                              <div className="inline-flex items-center gap-1">
                                {product.stock <= product.threshold && <button onClick={() => restockProduct(product)} className="mr-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Restock</button>}
                                <div className="relative">
                                  <button onClick={() => setActionMenuId((id) => id === product.id ? null : product.id)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900" aria-label={`Actions for ${product.name}`} aria-expanded={actionMenuId === product.id}><Icon name="more" className="size-4" /></button>
                                  {actionMenuId === product.id && <div className="absolute right-0 top-9 z-10 w-36 rounded-xl border border-zinc-200 bg-white p-1 text-left shadow-xl">
                                    {isAdmin && <button onClick={() => { setActionMenuId(null); openEditProduct(product); }} className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold hover:bg-zinc-100">Edit product</button>}
                                    {isAdmin && <button onClick={() => { setActionMenuId(null); deleteProduct(product); }} className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete product</button>}
                                  </div>}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                )}

                {!loadingProducts && !apiError && <div className="divide-y divide-zinc-100 md:hidden">
                  {pageProducts.map((product) => (
                    <div key={product.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" aria-label={`Select ${product.name}`} checked={selectedIds.includes(product.id)} onChange={() => setSelectedIds((ids) => ids.includes(product.id) ? ids.filter((id) => id !== product.id) : [...ids, product.id])} />
                        <div className={`flex size-11 items-center justify-center rounded-xl text-sm font-bold ${product.color}`}>{product.symbol}</div>
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{product.name}</p><p className="mt-1 text-xs text-zinc-400">{product.sku}</p></div>
                        {product.stock <= product.threshold && <button onClick={() => restockProduct(product)} className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Restock</button>}
                      </div>
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2">
                        <span className="text-xs text-zinc-500">{product.category}</span>
                        <span className={`text-xs font-semibold ${product.stock === 0 ? "text-rose-600" : product.stock <= product.threshold ? "text-amber-600" : "text-emerald-600"}`}>{product.stock} units</span>
                        <span className="text-xs font-bold">₱{product.price.toLocaleString()}</span>
                      </div>
                      <div className="mt-2 flex justify-end gap-2">
                        {isAdmin && <button onClick={() => openEditProduct(product)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"><Icon name="edit" className="size-3.5" />Edit</button>}
                        {isAdmin && <button onClick={() => deleteProduct(product)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"><Icon name="trash" className="size-3.5" />Delete</button>}
                      </div>
                    </div>
                  ))}
                </div>}

                {!loadingProducts && !apiError && filtered.length === 0 && <div className="py-16 text-center"><div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400"><Icon name="search" /></div><p className="font-semibold">No products found</p><p className="mt-1 text-sm text-zinc-400">Try adjusting your search or filters.</p>{(query || category !== "All items" || stockFilter !== "All stock") && <button type="button" onClick={() => { setQuery(""); setCategory("All items"); setStockFilter("All stock"); }} className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700">Clear search and filters</button>}</div>}

                {!loadingProducts && !apiError && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-5 py-4">
                  <p className="text-xs text-zinc-400">Showing <span className="font-semibold text-zinc-700">{filtered.length ? page * pageSize + 1 : 0}-{Math.min((page + 1) * pageSize, filtered.length)}</span> of {filtered.length} products</p>
                  <div className="flex items-center gap-2">
                    <button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                    <span className="px-1 text-xs text-zinc-400">{page + 1} / {pageCount}</span>
                    <button type="button" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
                  </div>
                </div>}
              </section>
            )}
          </div>
        </main>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-title">
          <form onSubmit={saveProduct} className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div><h2 id="add-title" className="text-xl font-bold">{editingProduct ? "Edit product" : "Add a new product"}</h2><p className="mt-1 text-sm text-zinc-500">{editingProduct ? "Update the item details and stock level." : "Add an item to your inventory catalog."}</p></div>
              <button type="button" onClick={closeProductForm} className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100" aria-label="Close dialog"><Icon name="x" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-bold text-zinc-600">Accessory name</span><input ref={productNameInput} required name="name" defaultValue={editingProduct?.name ?? ""} placeholder="e.g. LED Fog Light Kit" className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50" /></label>
              <label><span className="mb-1.5 block text-xs font-bold text-zinc-600">SKU</span><input required name="sku" defaultValue={editingProduct?.sku ?? ""} placeholder="AUD-0001" className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50" /></label>
              <label><span className="mb-1.5 block text-xs font-bold text-zinc-600">Category</span><select name="category" defaultValue={editingProduct?.category ?? categories[0] ?? "Parts"} className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-red-400">{[...new Set([...categories, "Lighting", "Interior", "Electronics", "Car Care", "Exterior", "Security", "Parts"])].sort().map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span className="mb-1.5 block text-xs font-bold text-zinc-600">Starting stock</span><input required min="0" step="1" type="number" name="stock" defaultValue={editingProduct?.stock ?? 20} className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50" /></label>
              <label><span className="mb-1.5 block text-xs font-bold text-zinc-600">Unit price</span><input required min="0" step="0.01" type="number" name="price" defaultValue={editingProduct?.price ?? ""} placeholder="0.00" className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50" /></label>
            </div>
            <details open={Boolean(editingProduct)} className="group mt-4 rounded-xl border border-zinc-200 px-3.5 py-2.5">
              <summary className="cursor-pointer text-xs font-semibold text-zinc-600">Low-stock alert settings</summary>
              <label className="mt-3 block"><span className="mb-1.5 block text-xs font-bold text-zinc-600">Alert when stock reaches</span><input min="0" step="1" type="number" name="threshold" defaultValue={editingProduct?.threshold ?? 10} className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50" /></label>
            </details>
            {formError && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{formError}</p>}
            <div className="mt-7 flex justify-end gap-2"><Button type="button" variant="secondary" onClick={closeProductForm}>Cancel</Button><Button type="submit">{editingProduct ? "Save changes" : "Add product"}</Button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  function login(nextSession: Session) {
    setSession(nextSession);
  }

  useEffect(() => {
    inventoryRequest<{ user: Session }>("/auth/me")
      .then((result) => setSession(result.user))
      .catch(() => setSession(null))
      .finally(() => setCheckingSession(false));
  }, []);

  async function logout() {
    try {
      await inventoryRequest<{ signedOut: boolean }>("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Unable to sign out from the inventory API.", error);
    }
    setSession(null);
  }

  if (checkingSession) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm font-bold uppercase tracking-wider text-zinc-400">Checking inventory session...</div>;
  }
  if (!session) return <LoginView onLogin={login} />;
  return <InventoryDashboard session={session} onLogout={logout} />;
}

export default App;
