//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, a) => (a = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)), l = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome, u = /(\s*@(property|font-face)[\s\S]*?{[\s\S]*?})/gm;
function d(e) {
	return {
		documentCss: Array.from(e.matchAll(u), (e) => e[0]).join("").trim(),
		shadowCss: e.replace(u, "").trim()
	};
}
var f = {
	debug: (...e) => ([...e], void 0),
	log: (...e) => ([...e], void 0),
	warn: (...e) => ([...e], void 0),
	error: (...e) => ([...e], void 0)
}, p = Symbol("null"), m = 0, h = class extends Map {
	constructor(...e) {
		super(), this._objectHashes = /* @__PURE__ */ new WeakMap(), this._symbolHashes = /* @__PURE__ */ new Map(), this._publicKeys = /* @__PURE__ */ new Map();
		let [t] = e;
		if (t != null) {
			if (typeof t[Symbol.iterator] != "function") throw TypeError(typeof t + " is not iterable (cannot read property Symbol(Symbol.iterator))");
			for (let [e, n] of t) this.set(e, n);
		}
	}
	_getPublicKeys(e, t = !1) {
		if (!Array.isArray(e)) throw TypeError("The keys parameter must be an array");
		let n = this._getPrivateKey(e, t), r;
		return n && this._publicKeys.has(n) ? r = this._publicKeys.get(n) : t && (r = [...e], this._publicKeys.set(n, r)), {
			privateKey: n,
			publicKey: r
		};
	}
	_getPrivateKey(e, t = !1) {
		let n = [];
		for (let r of e) {
			let e = r === null ? p : r, i;
			if (i = typeof e == "object" || typeof e == "function" ? "_objectHashes" : typeof e == "symbol" ? "_symbolHashes" : !1, !i) n.push(e);
			else if (this[i].has(e)) n.push(this[i].get(e));
			else if (t) {
				let t = `@@mkm-ref-${m++}@@`;
				this[i].set(e, t), n.push(t);
			} else return !1;
		}
		return JSON.stringify(n);
	}
	set(e, t) {
		let { publicKey: n } = this._getPublicKeys(e, !0);
		return super.set(n, t);
	}
	get(e) {
		let { publicKey: t } = this._getPublicKeys(e);
		return super.get(t);
	}
	has(e) {
		let { publicKey: t } = this._getPublicKeys(e);
		return super.has(t);
	}
	delete(e) {
		let { publicKey: t, privateKey: n } = this._getPublicKeys(e);
		return !!(t && super.delete(t) && this._publicKeys.delete(n));
	}
	clear() {
		super.clear(), this._symbolHashes.clear(), this._publicKeys.clear();
	}
	get [Symbol.toStringTag]() {
		return "ManyKeysMap";
	}
	get size() {
		return super.size;
	}
};
//#endregion
//#region node_modules/.pnpm/defu@6.1.7/node_modules/defu/dist/defu.mjs
function g(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return t !== null && t !== Object.prototype && Object.getPrototypeOf(t) !== null || Symbol.iterator in e ? !1 : Symbol.toStringTag in e ? Object.prototype.toString.call(e) === "[object Module]" : !0;
}
function _(e, t, n = ".", r) {
	if (!g(t)) return _(e, {}, n, r);
	let i = { ...t };
	for (let t of Object.keys(e)) {
		if (t === "__proto__" || t === "constructor") continue;
		let a = e[t];
		a != null && (r && r(i, t, a, n) || (Array.isArray(a) && Array.isArray(i[t]) ? i[t] = [...a, ...i[t]] : g(a) && g(i[t]) ? i[t] = _(a, i[t], (n ? `${n}.` : "") + t.toString(), r) : i[t] = a));
	}
	return i;
}
function v(e) {
	return (...t) => t.reduce((t, n) => _(t, n, "", e), {});
}
var y = v(), b = (e) => e === null ? { isDetected: !1 } : {
	isDetected: !0,
	result: e
}, x = (e) => e === null ? {
	isDetected: !0,
	result: null
} : { isDetected: !1 }, ee = () => ({
	target: globalThis.document,
	unifyProcess: !0,
	detector: b,
	observeConfigs: {
		childList: !0,
		subtree: !0,
		attributes: !0
	},
	signal: void 0,
	customMatcher: void 0
}), S = (e, t) => y(e, t), C = new h();
function te(e) {
	let { defaultOptions: t } = e;
	return (e, n) => {
		let { target: r, unifyProcess: i, observeConfigs: a, detector: o, signal: s, customMatcher: c } = S(n, t), l = [
			e,
			r,
			i,
			a,
			o,
			s,
			c
		], u = C.get(l);
		if (i && u) return u;
		let d = new Promise(async (t, n) => {
			if (s?.aborted) return n(s.reason);
			let i = new MutationObserver(async (n) => {
				for (let a of n) {
					if (s?.aborted) {
						i.disconnect();
						break;
					}
					let n = await ne({
						selector: e,
						target: r,
						detector: o,
						customMatcher: c
					});
					if (n.isDetected) {
						i.disconnect(), t(n.result);
						break;
					}
				}
			});
			s?.addEventListener("abort", () => (i.disconnect(), n(s.reason)), { once: !0 });
			let l = await ne({
				selector: e,
				target: r,
				detector: o,
				customMatcher: c
			});
			if (l.isDetected) return t(l.result);
			i.observe(r, a);
		}).finally(() => {
			C.delete(l);
		});
		return C.set(l, d), d;
	};
}
async function ne({ target: e, selector: t, detector: n, customMatcher: r }) {
	return await n(r ? r(t) : e.querySelector(t));
}
var re = te({ defaultOptions: ee() });
//#endregion
//#region node_modules/.pnpm/wxt@0.20.25_@types+node@25.6.0_eslint@10.2.1_jiti@2.6.1__jiti@2.6.1/node_modules/wxt/dist/utils/content-script-ui/shared.mjs
function ie(e, t, n) {
	n.position !== "inline" && (n.zIndex != null && (e.style.zIndex = String(n.zIndex)), e.style.overflow = "visible", e.style.position = "relative", e.style.width = "0", e.style.height = "0", e.style.display = "block", t && (n.position === "overlay" ? (t.style.position = "absolute", n.alignment?.startsWith("bottom-") ? t.style.bottom = "0" : t.style.top = "0", n.alignment?.endsWith("-right") ? t.style.right = "0" : t.style.left = "0") : (t.style.position = "fixed", t.style.top = "0", t.style.bottom = "0", t.style.left = "0", t.style.right = "0")));
}
function ae(e) {
	if (e.anchor == null) return document.body;
	let t = typeof e.anchor == "function" ? e.anchor() : e.anchor;
	return typeof t == "string" ? t.startsWith("/") ? document.evaluate(t, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ?? void 0 : document.querySelector(t) ?? void 0 : t ?? void 0;
}
function oe(e, t) {
	let n = ae(t);
	if (n == null) throw Error("Failed to mount content script UI: could not find anchor element");
	switch (t.append) {
		case void 0:
		case "last":
			n.append(e);
			break;
		case "first":
			n.prepend(e);
			break;
		case "replace":
			n.replaceWith(e);
			break;
		case "after":
			n.parentElement?.insertBefore(e, n.nextElementSibling);
			break;
		case "before":
			n.parentElement?.insertBefore(e, n);
			break;
		default: t.append(n, e);
	}
}
function se(e, t) {
	let n, r = () => {
		n?.stopAutoMount(), n = void 0;
	}, i = () => {
		e.mount();
	}, a = e.remove;
	return {
		mount: i,
		remove: () => {
			r(), e.remove();
		},
		autoMount: (e) => {
			n && f.warn("autoMount is already set."), n = ce({
				mount: i,
				unmount: a,
				stopAutoMount: r
			}, {
				...t,
				...e
			});
		}
	};
}
function ce(e, t) {
	let n = new AbortController(), r = "explicit_stop_auto_mount", i = () => {
		n.abort(r), t.onStop?.();
	}, a = typeof t.anchor == "function" ? t.anchor() : t.anchor;
	if (a instanceof Element) throw Error("autoMount and Element anchor option cannot be combined. Avoid passing `Element` directly or `() => Element` to the anchor.");
	async function o(i) {
		let a = !!ae(t);
		for (a && e.mount(); !n.signal.aborted;) try {
			a = !!await re(i ?? "body", {
				customMatcher: () => ae(t) ?? null,
				detector: a ? x : b,
				signal: n.signal
			}), a ? e.mount() : (e.unmount(), t.once && e.stopAutoMount());
		} catch (e) {
			if (n.signal.aborted && n.signal.reason === r) break;
			throw e;
		}
	}
	return o(a), { stopAutoMount: i };
}
//#endregion
//#region node_modules/.pnpm/@webext-core+isolated-element@1.1.5/node_modules/@webext-core/isolated-element/lib/index.js
var le = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	var n = /^[a-z](?:[\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\x2D\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
	t.exports = function(e) {
		return n.test(e);
	};
})))(), 1), ue = (e, t, n) => new Promise((r, i) => {
	var a = (e) => {
		try {
			s(n.next(e));
		} catch (e) {
			i(e);
		}
	}, o = (e) => {
		try {
			s(n.throw(e));
		} catch (e) {
			i(e);
		}
	}, s = (e) => e.done ? r(e.value) : Promise.resolve(e.value).then(a, o);
	s((n = n.apply(e, t)).next());
}), de = [
	"article",
	"aside",
	"blockquote",
	"body",
	"div",
	"footer",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"main",
	"nav",
	"p",
	"section",
	"span"
];
function w(e) {
	return ue(this, null, function* () {
		let { name: t, mode: n = "closed", css: r, isolateEvents: i = !1 } = e;
		if (!de.includes(t) && !(0, le.default)(t)) throw Error(`"${t}" cannot have a shadow root attached to it. It must be two words and kebab-case, with a few exceptions. See https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#elements_you_can_attach_a_shadow_to`);
		let a = document.createElement(t), o = a.attachShadow({ mode: n }), s = document.createElement("html"), c = document.createElement("body"), l = document.createElement("head");
		if (r) {
			let e = document.createElement("style");
			"url" in r ? e.textContent = yield fetch(r.url).then((e) => e.text()) : e.textContent = r.textContent, l.appendChild(e);
		}
		return s.appendChild(l), s.appendChild(c), o.appendChild(s), i && (Array.isArray(i) ? i : [
			"keydown",
			"keyup",
			"keypress"
		]).forEach((e) => {
			c.addEventListener(e, (e) => e.stopPropagation());
		}), {
			parentElement: a,
			shadow: o,
			isolatedElement: c
		};
	});
}
//#endregion
//#region node_modules/.pnpm/wxt@0.20.25_@types+node@25.6.0_eslint@10.2.1_jiti@2.6.1__jiti@2.6.1/node_modules/wxt/dist/utils/content-script-ui/shadow-root.mjs
async function fe(e, t) {
	let n = Math.random().toString(36).substring(2, 15), r = [];
	if (t.inheritStyles || r.push("/* WXT Shadow Root Reset */ :host{all:initial !important;}"), t.css && r.push(t.css), e.options?.cssInjectionMode === "ui") {
		let e = await pe();
		r.push(e.replaceAll(":root", ":host"));
	}
	let { shadowCss: i, documentCss: a } = d(r.join("\n").trim()), { isolatedElement: o, parentElement: s, shadow: c } = await w({
		name: t.name,
		css: { textContent: i },
		mode: t.mode ?? "open",
		isolateEvents: t.isolateEvents
	}), l, u = () => {
		if (oe(s, t), ie(s, c.querySelector("html"), t), a && !document.querySelector(`style[wxt-shadow-root-document-styles="${n}"]`)) {
			let e = document.createElement("style");
			e.textContent = a, e.setAttribute("wxt-shadow-root-document-styles", n), (document.head ?? document.body).append(e);
		}
		l = t.onMount(o, c, s);
	}, f = () => {
		for (t.onRemove?.(l), s.remove(), document.querySelector(`style[wxt-shadow-root-document-styles="${n}"]`)?.remove(); o.lastChild;) o.removeChild(o.lastChild);
		l = void 0;
	}, p = se({
		mount: u,
		remove: f
	}, t);
	return e.onInvalidated(f), {
		shadow: c,
		shadowHost: s,
		uiContainer: o,
		...p,
		get mounted() {
			return l;
		}
	};
}
async function pe() {
	let e = l.runtime.getURL("/content-scripts/content.css");
	try {
		return await (await fetch(e)).text();
	} catch (t) {
		return f.warn(`Failed to load styles @ ${e}. Did you forget to import the stylesheet in your entrypoint?`, t), "";
	}
}
//#endregion
//#region src/shared/constants.ts
var me = "translator-content-app", he = "translator-inline-root", ge = "[data-theme-color=\"custom\"]{--md-color-primary:#6750a4;--md-color-on-primary:#ffffff;--md-color-primary-container:#e9ddff;--md-color-on-primary-container:#4f378a;--md-color-secondary:#625b71;--md-color-on-secondary:#ffffff;--md-color-secondary-container:#e8def8;--md-color-on-secondary-container:#4a4458;--md-color-tertiary:#7e5260;--md-color-on-tertiary:#ffffff;--md-color-tertiary-container:#ffd9e3;--md-color-on-tertiary-container:#633b48;--md-color-error:#ba1a1a;--md-color-on-error:#ffffff;--md-color-error-container:#ffdad6;--md-color-on-error-container:#93000a;--md-color-background:#f9f9f9;--md-color-on-background:#1b1b1b;--md-color-surface:#f9f9f9;--md-color-on-surface:#1b1b1b;--md-color-surface-dim:#dadada;--md-color-surface-bright:#f9f9f9;--md-color-surface-variant:#e2e2e2;--md-color-on-surface-variant:#474747;--md-color-surface-container-lowest:#ffffff;--md-color-surface-container-low:#f3f3f3;--md-color-surface-container:#eeeeee;--md-color-surface-container-high:#e8e8e8;--md-color-surface-container-highest:#e2e2e2;--md-color-outline:#777777;--md-color-outline-variant:#c6c6c6;--md-color-shadow:#000000;--md-color-scrim:#000000;&:where([data-theme=\"dark\"]){--md-color-primary:#cfbcff;--md-color-on-primary:#381e72;--md-color-primary-container:#4f378a;--md-color-on-primary-container:#e9ddff;--md-color-secondary:#cbc2db;--md-color-on-secondary:#332d41;--md-color-secondary-container:#4a4458;--md-color-on-secondary-container:#e8def8;--md-color-tertiary:#efb8c8;--md-color-on-tertiary:#4a2532;--md-color-tertiary-container:#633b48;--md-color-on-tertiary-container:#ffd9e3;--md-color-error:#ffb4ab;--md-color-on-error:#690005;--md-color-error-container:#93000a;--md-color-on-error-container:#ffdad6;--md-color-background:#131313;--md-color-on-background:#e2e2e2;--md-color-surface:#131313;--md-color-on-surface:#e2e2e2;--md-color-surface-dim:#131313;--md-color-surface-bright:#393939;--md-color-surface-variant:#474747;--md-color-on-surface-variant:#c6c6c6;--md-color-surface-container-lowest:#0e0e0e;--md-color-surface-container-low:#1b1b1b;--md-color-surface-container:#1f1f1f;--md-color-surface-container-high:#2a2a2a;--md-color-surface-container-highest:#353535;--md-color-outline:#919191;--md-color-outline-variant:#474747;--md-color-shadow:#000000;--md-color-scrim:#000000;}}";
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/constants.js
var _e = {}, ve = Symbol(), ye = "http://www.w3.org/1999/xhtml", be = "http://www.w3.org/2000/svg", xe = "http://www.w3.org/1998/Math/MathML", Se = Array.isArray, Ce = Array.prototype.indexOf, we = Array.prototype.includes, Te = Array.from, Ee = Object.defineProperty, De = Object.getOwnPropertyDescriptor, Oe = Object.getOwnPropertyDescriptors, ke = Object.prototype, Ae = Array.prototype, je = Object.getPrototypeOf, Me = Object.isExtensible;
function Ne(e) {
	return typeof e == "function";
}
var Pe = () => {};
function Fe(e) {
	return typeof e?.then == "function";
}
function Ie(e) {
	return e();
}
function Le(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function Re() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/constants.js
var ze = 1 << 24, Be = 1024, Ve = 2048, He = 4096, Ue = 8192, We = 16384, Ge = 32768, Ke = 1 << 25, qe = 65536, Je = 1 << 19, Ye = 1 << 20, Xe = 1 << 25, Ze = 65536, Qe = 1 << 21, $e = 1 << 22, et = 1 << 23, tt = Symbol("$state"), nt = Symbol("legacy props"), rt = Symbol(""), it = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), at = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function ot(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
function st() {
	throw Error("https://svelte.dev/e/missing_context");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/errors.js
function ct() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function lt(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ut(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function dt() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function ft(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function pt() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function mt(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function ht() {
	throw Error("https://svelte.dev/e/set_context_after_init");
}
function gt() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function _t() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function vt() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function yt() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function bt() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function xt(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function St() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ct() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/hydration.js
var T = !1;
function wt(e) {
	T = e;
}
var Tt;
function Et(e) {
	if (e === null) throw xt(), _e;
	return Tt = e;
}
function Dt() {
	return Et(/* @__PURE__ */ hr(Tt));
}
function E(e) {
	if (T) {
		if (/* @__PURE__ */ hr(Tt) !== null) throw xt(), _e;
		Tt = e;
	}
}
function Ot(e = 1) {
	if (T) {
		for (var t = e, n = Tt; t--;) n = /* @__PURE__ */ hr(n);
		Tt = n;
	}
}
function kt(e = !0) {
	for (var t = 0, n = Tt;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ hr(n);
		e && n.remove(), n = i;
	}
}
function At(e) {
	if (!e || e.nodeType !== 8) throw xt(), _e;
	return e.data;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/reactivity/equality.js
function jt(e) {
	return e === this.v;
}
function Mt(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Nt(e) {
	return !Mt(e, this.v);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/flags/index.js
var Pt = !1, Ft = !1;
function It() {
	Ft = !0;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/shared/clone.js
var Lt = [];
function Rt(e, t = !1, n = !1) {
	return zt(e, /* @__PURE__ */ new Map(), "", Lt, null, n);
}
function zt(e, t, n, r, i = null, a = !1) {
	if (typeof e == "object" && e) {
		var o = t.get(e);
		if (o !== void 0) return o;
		if (e instanceof Map) return new Map(e);
		if (e instanceof Set) return new Set(e);
		if (Se(e)) {
			var s = Array(e.length);
			t.set(e, s), i !== null && t.set(i, s);
			for (var c = 0; c < e.length; c += 1) {
				var l = e[c];
				c in e && (s[c] = zt(l, t, n, r, null, a));
			}
			return s;
		}
		if (je(e) === ke) {
			s = {}, t.set(e, s), i !== null && t.set(i, s);
			for (var u of Object.keys(e)) s[u] = zt(e[u], t, n, r, null, a);
			return s;
		}
		if (e instanceof Date) return structuredClone(e);
		if (typeof e.toJSON == "function" && !a) return zt(e.toJSON(), t, n, r, e);
	}
	if (e instanceof EventTarget) return e;
	try {
		return structuredClone(e);
	} catch {
		return e;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/context.js
var Bt = null;
function Vt(e) {
	Bt = e;
}
function Ht() {
	let e = {};
	return [() => (Gt(e) || st(), Ut(e)), (t) => Wt(e, t)];
}
function Ut(e) {
	return Yt("getContext").get(e);
}
function Wt(e, t) {
	let n = Yt("setContext");
	if (Pt) {
		var r = oi.f;
		!ri && r & 32 && !Bt.i || ht();
	}
	return n.set(e, t), t;
}
function Gt(e) {
	return Yt("hasContext").has(e);
}
function Kt(e, t = !1, n) {
	Bt = {
		p: Bt,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: oi,
		l: Ft && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function qt(e) {
	var t = Bt, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Mr(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Bt = t.p, e ?? {};
}
function Jt() {
	return !Ft || Bt !== null && Bt.l === null;
}
function Yt(e) {
	return Bt === null && ot(e), Bt.c ??= new Map(Xt(Bt) || void 0);
}
function Xt(e) {
	let t = e.p;
	for (; t !== null;) {
		let e = t.c;
		if (e !== null) return e;
		t = t.p;
	}
	return null;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/task.js
var Zt = [];
function Qt() {
	var e = Zt;
	Zt = [], Le(e);
}
function $t(e) {
	if (Zt.length === 0 && !_n) {
		var t = Zt;
		queueMicrotask(() => {
			t === Zt && Qt();
		});
	}
	Zt.push(e);
}
function en() {
	for (; Zt.length > 0;) Qt();
}
function tn(e) {
	var t = oi;
	if (t === null) return ri.f |= et, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	nn(e, t);
}
function nn(e, t) {
	for (; t !== null;) {
		if (t.f & 128) {
			if (!(t.f & 32768)) throw e;
			try {
				t.b.error(e);
				return;
			} catch (t) {
				e = t;
			}
		}
		t = t.parent;
	}
	throw e;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/reactivity/status.js
var rn = ~(Ve | He | Be);
function an(e, t) {
	e.f = e.f & rn | t;
}
function on(e) {
	e.f & 512 || e.deps === null ? an(e, Be) : an(e, He);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/reactivity/utils.js
function sn(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= Ze, sn(t.deps));
}
function cn(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), sn(e.deps), an(e, Be);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/reactivity/store.js
var ln = !1, un = !1;
function dn(e) {
	var t = un;
	try {
		return un = !1, [e(), un];
	} finally {
		un = t;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/reactivity/batch.js
var fn = /* @__PURE__ */ new Set(), pn = null, mn = null, hn = null, gn = null, _n = !1, vn = !1, yn = null, bn = null, xn = 0, Sn = 1, Cn = class e {
	id = Sn++;
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#e = /* @__PURE__ */ new Set();
	#t = /* @__PURE__ */ new Set();
	#n = /* @__PURE__ */ new Set();
	#r = /* @__PURE__ */ new Map();
	#i = /* @__PURE__ */ new Map();
	#a = null;
	#o = [];
	#s = [];
	#c = /* @__PURE__ */ new Set();
	#l = /* @__PURE__ */ new Set();
	#u = /* @__PURE__ */ new Map();
	#d = /* @__PURE__ */ new Set();
	is_fork = !1;
	#f = !1;
	#p = /* @__PURE__ */ new Set();
	#m() {
		return this.is_fork || this.#i.size > 0;
	}
	#h() {
		for (let n of this.#p) for (let r of n.#i.keys()) {
			for (var e = !1, t = r; t.parent !== null;) {
				if (this.#u.has(t)) {
					e = !0;
					break;
				}
				t = t.parent;
			}
			if (!e) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#u.has(e) || this.#u.set(e, {
			d: [],
			m: []
		}), this.#d.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#u.get(e);
		if (n) {
			this.#u.delete(e);
			for (var r of n.d) an(r, Ve), t(r);
			for (r of n.m) an(r, He), t(r);
		}
		this.#d.add(e);
	}
	#g() {
		if (xn++ > 1e3 && (fn.delete(this), Tn()), !this.#m()) {
			for (let e of this.#c) this.#l.delete(e), an(e, Ve), this.schedule(e);
			for (let e of this.#l) an(e, He), this.schedule(e);
		}
		let t = this.#o;
		this.#o = [], this.apply();
		var n = yn = [], r = [], i = bn = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Mn(e), t;
		}
		if (pn = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (yn = null, bn = null, this.#m() || this.#h()) {
			this.#v(r), this.#v(n);
			for (let [e, t] of this.#u) jn(e, t);
		} else {
			this.#r.size === 0 && fn.delete(this), this.#c.clear(), this.#l.clear();
			for (let e of this.#e) e(this);
			this.#e.clear(), mn = this, Dn(r), Dn(n), mn = null, this.#a?.resolve();
		}
		var o = pn;
		if (this.#o.length > 0) {
			let e = o ??= this;
			e.#o.push(...this.#o.filter((t) => !e.#o.includes(t)));
		}
		o !== null && (fn.add(o), o.#g()), Pt && !fn.has(this) && this.#y();
	}
	#_(e, t, n) {
		e.f ^= Be;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = (i & 96) != 0;
			if (!(a && i & 1024 || i & 8192 || this.#u.has(r)) && r.fn !== null) {
				a ? r.f ^= Be : i & 4 ? t.push(r) : Pt && i & 16777224 ? n.push(r) : yi(r) && (i & 16 && this.#l.add(r), wi(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#v(e) {
		for (var t = 0; t < e.length; t += 1) cn(e[t], this.#c, this.#l);
	}
	capture(e, t, n = !1) {
		e.v !== ve && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), hn?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		pn = this;
	}
	deactivate() {
		pn = null, hn = null;
	}
	flush() {
		try {
			vn = !0, pn = this, this.#g();
		} finally {
			xn = 0, gn = null, yn = null, bn = null, vn = !1, pn = null, hn = null, Xn.clear();
		}
	}
	discard() {
		for (let e of this.#t) e(this);
		this.#t.clear(), this.#n.clear(), fn.delete(this);
	}
	register_created_effect(e) {
		this.#s.push(e);
	}
	#y() {
		for (let l of fn) {
			var e = l.id < this.id, t = [];
			for (let [r, [i, a]] of this.current) {
				if (l.current.has(r)) {
					var n = l.current.get(r)[0];
					if (e && i !== n) l.current.set(r, [i, a]);
					else continue;
				}
				t.push(r);
			}
			var r = [...l.current.keys()].filter((e) => !this.current.has(e));
			if (r.length === 0) e && l.discard();
			else if (t.length > 0) {
				if (e) for (let e of this.#d) l.unskip_effect(e, (e) => {
					e.f & 4194320 ? l.schedule(e) : l.#v([e]);
				});
				l.activate();
				var i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
				for (var o of t) On(o, r, i, a);
				a = /* @__PURE__ */ new Map();
				var s = [...l.current.keys()].filter((e) => this.current.has(e) ? this.current.get(e)[0] !== e : !0);
				for (let e of this.#s) !(e.f & 155648) && kn(e, s, a) && (e.f & 4194320 ? (an(e, Ve), l.schedule(e)) : l.#c.add(e));
				if (l.#o.length > 0) {
					l.apply();
					for (var c of l.#o) l.#_(c, [], []);
					l.#o = [];
				}
				l.deactivate();
			}
		}
		for (let e of fn) e.#p.has(this) && (e.#p.delete(this), e.#p.size === 0 && !e.#m() && (e.activate(), e.#g()));
	}
	increment(e, t) {
		let n = this.#r.get(t) ?? 0;
		if (this.#r.set(t, n + 1), e) {
			let e = this.#i.get(t) ?? 0;
			this.#i.set(t, e + 1);
		}
	}
	decrement(e, t, n) {
		let r = this.#r.get(t) ?? 0;
		if (r === 1 ? this.#r.delete(t) : this.#r.set(t, r - 1), e) {
			let e = this.#i.get(t) ?? 0;
			e === 1 ? this.#i.delete(t) : this.#i.set(t, e - 1);
		}
		this.#f || n || (this.#f = !0, $t(() => {
			this.#f = !1, this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#c.add(t);
		for (let e of t) this.#l.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#e.add(e);
	}
	ondiscard(e) {
		this.#t.add(e);
	}
	on_fork_commit(e) {
		this.#n.add(e);
	}
	run_fork_commit_callbacks() {
		for (let e of this.#n) e(this);
		this.#n.clear();
	}
	settled() {
		return (this.#a ??= Re()).promise;
	}
	static ensure() {
		if (pn === null) {
			let t = pn = new e();
			vn || (fn.add(pn), _n || $t(() => {
				pn === t && t.flush();
			}));
		}
		return pn;
	}
	apply() {
		if (!Pt || !this.is_fork && fn.size === 1) {
			hn = null;
			return;
		}
		hn = /* @__PURE__ */ new Map();
		for (let [e, [t]] of this.current) hn.set(e, t);
		for (let n of fn) if (!(n === this || n.is_fork)) {
			var e = !1, t = !1;
			if (n.id < this.id) for (let [r, [, i]] of n.current) i || (e ||= this.current.has(r), t ||= !this.current.has(r));
			if (e && t) this.#p.add(n);
			else for (let [e, t] of n.previous) hn.has(e) || hn.set(e, t);
		}
	}
	schedule(e) {
		if (gn = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (yn !== null && t === oi && (Pt || (ri === null || !(ri.f & 2)) && !ln)) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= Be;
			}
		}
		this.#o.push(t);
	}
};
function wn(e) {
	var t = _n;
	_n = !0;
	try {
		var n;
		for (e && (pn !== null && !pn.is_fork && pn.flush(), n = e());;) {
			if (en(), pn === null) return n;
			pn.flush();
		}
	} finally {
		_n = t;
	}
}
function Tn() {
	try {
		pt();
	} catch (e) {
		nn(e, gn);
	}
}
var En = null;
function Dn(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && yi(r) && (En = /* @__PURE__ */ new Set(), wi(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && qr(r), En?.size > 0)) {
				Xn.clear();
				for (let e of En) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) En.has(n) && (En.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || wi(n);
					}
				}
				En.clear();
			}
		}
		En = null;
	}
}
function On(e, t, n, r) {
	if (!n.has(e) && (n.add(e), e.reactions !== null)) for (let i of e.reactions) {
		let e = i.f;
		e & 2 ? On(i, t, n, r) : e & 4194320 && !(e & 2048) && kn(i, t, r) && (an(i, Ve), An(i));
	}
}
function kn(e, t, n) {
	let r = n.get(e);
	if (r !== void 0) return r;
	if (e.deps !== null) for (let r of e.deps) {
		if (we.call(t, r)) return !0;
		if (r.f & 2 && kn(r, t, n)) return n.set(r, !0), !0;
	}
	return n.set(e, !1), !1;
}
function An(e) {
	pn.schedule(e);
}
function jn(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), an(e, Be);
		for (var n = e.first; n !== null;) jn(n, t), n = n.next;
	}
}
function Mn(e) {
	an(e, Be);
	for (var t = e.first; t !== null;) Mn(t), t = t.next;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/reactivity/create-subscriber.js
function Nn(e) {
	let t = 0, n = Qn(0), r;
	return () => {
		kr() && (P(n), Rr(() => (t === 0 && (r = Oi(() => e(() => nr(n)))), t += 1, () => {
			$t(() => {
				--t, t === 0 && (r?.(), r = void 0, nr(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Pn = qe | Je;
function Fn(e, t, n, r) {
	new In(e, t, n, r);
}
var In = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = T ? Tt : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = Nn(() => (this.#m = Qn(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = oi;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = oi.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = zr(() => {
			if (T) {
				let e = this.#t;
				Dt();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#v() : this.#g();
			} else this.#y();
		}, Pn), T && (this.#e = Tt);
	}
	#g() {
		try {
			this.#a = Vr(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed;
		t && (this.#s = Vr(() => {
			t(this.#e, () => e, () => () => {});
		}));
	}
	#v() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Vr(() => e(this.#e)), $t(() => {
			var e = this.#c = document.createDocumentFragment(), t = pr();
			e.append(t), this.#a = this.#x(() => Vr(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Jr(this.#o, () => {
				this.#o = null;
			}), this.#b(pn));
		}));
	}
	#y() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Vr(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Qr(this.#a, e);
				let t = this.#n.pending;
				this.#o = Vr(() => t(this.#e));
			} else this.#b(pn);
		} catch (e) {
			this.error(e);
		}
	}
	#b(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		cn(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#x(e) {
		var t = oi, n = ri, r = Bt;
		si(this.#i), ai(this.#i), Vt(this.#i.ctx);
		try {
			return Cn.ensure(), e();
		} catch (e) {
			return tn(e), null;
		} finally {
			si(t), ai(n), Vt(r);
		}
	}
	#S(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#S(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#b(t), this.#o && Jr(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#S(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, $t(() => {
			this.#d = !1, this.#m && er(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), P(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		pn?.is_fork ? (this.#a && pn.skip_effect(this.#a), this.#o && pn.skip_effect(this.#o), this.#s && pn.skip_effect(this.#s), pn.on_fork_commit(() => {
			this.#C(e);
		})) : this.#C(e);
	}
	#C(e) {
		this.#a &&= (Gr(this.#a), null), this.#o &&= (Gr(this.#o), null), this.#s &&= (Gr(this.#s), null), T && (Et(this.#t), Ot(), Et(kt()));
		var t = this.#n.onerror;
		let n = this.#n.failed;
		var r = !1, i = !1;
		let a = () => {
			if (r) {
				Ct();
				return;
			}
			r = !0, i && yt(), this.#s !== null && Jr(this.#s, () => {
				this.#s = null;
			}), this.#x(() => {
				this.#y();
			});
		}, o = (e) => {
			try {
				i = !0, t?.(e, a), i = !1;
			} catch (e) {
				nn(e, this.#i && this.#i.parent);
			}
			n && (this.#s = this.#x(() => {
				try {
					return Vr(() => {
						var t = oi;
						t.b = this, t.f |= 128, n(this.#e, () => e, () => a);
					});
				} catch (e) {
					return nn(e, this.#i.parent), null;
				}
			}));
		};
		$t(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				nn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(o, (e) => nn(e, this.#i && this.#i.parent)) : o(t);
		});
	}
};
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/reactivity/async.js
function Ln(e, t, n, r) {
	let i = Jt() ? Vn : Un;
	var a = e.filter((e) => !e.settled);
	if (n.length === 0 && a.length === 0) {
		r(t.map(i));
		return;
	}
	var o = oi, s = Rn(), c = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function l(e) {
		s();
		try {
			r(e);
		} catch (e) {
			o.f & 16384 || nn(e, o);
		}
		zn();
	}
	if (n.length === 0) {
		c.then(() => l(t.map(i)));
		return;
	}
	var u = Bn();
	function d() {
		Promise.all(n.map((e) => /* @__PURE__ */ Hn(e))).then((e) => l([...t.map(i), ...e])).catch((e) => nn(e, o)).finally(() => u());
	}
	c ? c.then(() => {
		s(), d(), zn();
	}) : d();
}
function Rn() {
	var e = oi, t = ri, n = Bt, r = pn;
	return function(i = !0) {
		si(e), ai(t), Vt(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function zn(e = !0) {
	si(null), ai(null), Vt(null), e && pn?.deactivate();
}
function Bn() {
	var e = oi, t = e.b, n = pn, r = t.is_rendered();
	return t.update_pending_count(1, n), n.increment(r, e), (i = !1) => {
		t.update_pending_count(-1, n), n.decrement(r, e, i);
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Vn(e) {
	var t = 2 | Ve;
	return oi !== null && (oi.f |= Je), {
		ctx: Bt,
		deps: null,
		effects: null,
		equals: jt,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: ve,
		wv: 0,
		parent: oi,
		ac: null
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Hn(e, t, n) {
	let r = oi;
	r === null && ct();
	var i = void 0, a = Qn(ve), o = !ri, s = /* @__PURE__ */ new Map();
	return Lr(() => {
		var t = oi, n = Re();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, n.reject).finally(zn);
		} catch (e) {
			n.reject(e), zn();
		}
		var c = pn;
		if (o) {
			if (t.f & 32768) var l = Bn();
			if (r.b.is_rendered()) s.get(c)?.reject(it), s.delete(c);
			else {
				for (let e of s.values()) e.reject(it);
				s.clear();
			}
			s.set(c, n);
		}
		let u = (e, n = void 0) => {
			if (l && l(n === it), !(n === it || t.f & 16384)) {
				if (c.activate(), n) a.f |= et, er(a, n);
				else {
					a.f & 8388608 && (a.f ^= et), er(a, e);
					for (let [e, t] of s) {
						if (s.delete(e), e === c) break;
						t.reject(it);
					}
				}
				c.deactivate();
			}
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Ar(() => {
		for (let e of s.values()) e.reject(it);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/* @__NO_SIDE_EFFECTS__ */
function D(e) {
	let t = /* @__PURE__ */ Vn(e);
	return Pt || li(t), t;
}
/* @__NO_SIDE_EFFECTS__ */
function Un(e) {
	let t = /* @__PURE__ */ Vn(e);
	return t.equals = Nt, t;
}
function Wn(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Gr(t[n]);
	}
}
function Gn(e) {
	var t, n = oi, r = e.parent;
	if (!ti && r !== null && r.f & 24576) return bt(), e.v;
	si(r);
	try {
		e.f &= ~Ze, Wn(e), t = xi(e);
	} finally {
		si(n);
	}
	return t;
}
function Kn(e) {
	var t = Gn(e);
	if (!e.equals(t) && (e.wv = vi(), (!pn?.is_fork || e.deps === null) && (pn === null ? e.v = t : pn.capture(e, t, !0), e.deps === null))) {
		an(e, Be);
		return;
	}
	ti || (hn === null ? on(e) : (kr() || pn?.is_fork) && hn.set(e, t));
}
function qn(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(it), t.teardown = Pe, t.ac = null, Ci(t, 0), Ur(t));
}
function Jn(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && wi(t);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/reactivity/sources.js
var Yn = /* @__PURE__ */ new Set(), Xn = /* @__PURE__ */ new Map(), Zn = !1;
function Qn(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: jt,
		rv: 0,
		wv: 0
	};
}
/* @__NO_SIDE_EFFECTS__ */
function O(e, t) {
	let n = Qn(e, t);
	return li(n), n;
}
/* @__NO_SIDE_EFFECTS__ */
function $n(e, t = !1, n = !0) {
	let r = Qn(e);
	return t || (r.equals = Nt), Ft && n && Bt !== null && Bt.l !== null && (Bt.l.s ??= []).push(r), r;
}
function k(e, t, n = !1) {
	return ri !== null && (!ii || ri.f & 131072) && Jt() && ri.f & 4325394 && (ci === null || !we.call(ci, e)) && vt(), er(e, n ? ir(t) : t, bn);
}
function er(e, t, n = null) {
	if (!e.equals(t)) {
		Xn.set(e, ti ? t : e.v);
		var r = Cn.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Gn(t), hn === null && on(t);
		}
		e.wv = vi(), rr(e, Ve, n), Jt() && oi !== null && oi.f & 1024 && !(oi.f & 96) && (fi === null ? pi([e]) : fi.push(e)), !r.is_fork && Yn.size > 0 && !Zn && tr();
	}
	return t;
}
function tr() {
	Zn = !1;
	for (let e of Yn) e.f & 1024 && an(e, He), yi(e) && wi(e);
	Yn.clear();
}
function nr(e) {
	k(e, e.v + 1);
}
function rr(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Jt(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === oi)) {
			var l = (c & Ve) === 0;
			if (l && an(s, t), c & 2) {
				var u = s;
				hn?.delete(u), c & 65536 || (c & 512 && (s.f |= Ze), rr(u, He, n));
			} else if (l) {
				var d = s;
				c & 16 && En !== null && En.add(d), n === null ? An(d) : n.push(d);
			}
		}
	}
}
function ir(e) {
	if (typeof e != "object" || !e || tt in e) return e;
	let t = je(e);
	if (t !== ke && t !== Ae) return e;
	var n = /* @__PURE__ */ new Map(), r = Se(e), i = /* @__PURE__ */ O(0), a = null, o = gi, s = (e) => {
		if (gi === o) return e();
		var t = ri, n = gi;
		ai(null), _i(o);
		var r = e();
		return ai(t), _i(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ O(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && gt();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ O(r.value, a);
				return n.set(t, e), e;
			}) : k(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ O(ve, a));
					n.set(t, e), nr(i);
				}
			} else k(r, ve), nr(i);
			return !0;
		},
		get(t, r, i) {
			if (r === tt) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || De(t, r)?.writable) && (o = s(() => /* @__PURE__ */ O(ir(c ? t[r] : ve), a)), n.set(r, o)), o !== void 0) {
				var l = P(o);
				return l === ve ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var r = Reflect.getOwnPropertyDescriptor(e, t);
			if (r && "value" in r) {
				var i = n.get(t);
				i && (r.value = P(i));
			} else if (r === void 0) {
				var a = n.get(t), o = a?.v;
				if (a !== void 0 && o !== ve) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === tt) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== ve || Reflect.has(e, t);
			return (r !== void 0 || oi !== null && (!i || De(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ O(i ? ir(e[t]) : ve, a)), n.set(t, r)), P(r) === ve) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ O(ve, a)), n.set(d + "", f)) : k(f, ve);
			}
			if (l === void 0) (!u || De(e, t)?.writable) && (l = s(() => /* @__PURE__ */ O(void 0, a)), k(l, ir(o)), n.set(t, l));
			else {
				u = l.v !== ve;
				var p = s(() => ir(o));
				k(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var h = n.get("length"), g = Number(t);
					Number.isInteger(g) && g >= h.v && k(h, g + 1);
				}
				nr(i);
			}
			return !0;
		},
		ownKeys(e) {
			P(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== ve;
			});
			for (var [r, a] of n) a.v !== ve && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			_t();
		}
	});
}
function ar(e) {
	try {
		if (typeof e == "object" && e && tt in e) return e[tt];
	} catch {}
	return e;
}
function or(e, t) {
	return Object.is(ar(e), ar(t));
}
var sr, cr, lr, ur, dr;
function fr() {
	if (sr === void 0) {
		sr = window, cr = document, lr = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		ur = De(t, "firstChild").get, dr = De(t, "nextSibling").get, Me(e) && (e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__style = void 0, e.__e = void 0), Me(n) && (n.__t = void 0);
	}
}
function pr(e = "") {
	return document.createTextNode(e);
}
/* @__NO_SIDE_EFFECTS__ */
function mr(e) {
	return ur.call(e);
}
/* @__NO_SIDE_EFFECTS__ */
function hr(e) {
	return dr.call(e);
}
function A(e, t) {
	if (!T) return /* @__PURE__ */ mr(e);
	var n = /* @__PURE__ */ mr(Tt);
	if (n === null) n = Tt.appendChild(pr());
	else if (t && n.nodeType !== 3) {
		var r = pr();
		return n?.before(r), Et(r), r;
	}
	return t && yr(n), Et(n), n;
}
function j(e, t = !1) {
	if (!T) {
		var n = /* @__PURE__ */ mr(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ hr(n) : n;
	}
	if (t) {
		if (Tt?.nodeType !== 3) {
			var r = pr();
			return Tt?.before(r), Et(r), r;
		}
		yr(Tt);
	}
	return Tt;
}
function M(e, t = 1, n = !1) {
	let r = T ? Tt : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ hr(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = pr();
			return r === null ? i?.after(a) : r.before(a), Et(a), a;
		}
		yr(r);
	}
	return Et(r), r;
}
function gr(e) {
	e.textContent = "";
}
function _r() {
	return !Pt || En !== null ? !1 : (oi.f & Ge) !== 0;
}
function vr(e, t, n) {
	let r = n ? { is: n } : void 0;
	return document.createElementNS(t ?? "http://www.w3.org/1999/xhtml", e, r);
}
function yr(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/misc.js
function br(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, $t(() => {
			document.activeElement === t && e.focus();
		});
	}
}
function xr(e) {
	T && /* @__PURE__ */ mr(e) !== null && gr(e);
}
var Sr = !1;
function Cr() {
	Sr || (Sr = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t.__on_r?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function wr(e) {
	var t = ri, n = oi;
	ai(null), si(null);
	try {
		return e();
	} finally {
		ai(t), si(n);
	}
}
function Tr(e, t, n, r = n) {
	e.addEventListener(t, () => wr(n));
	let i = e.__on_r;
	i ? e.__on_r = () => {
		i(), r(!0);
	} : e.__on_r = () => r(!0), Cr();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/reactivity/effects.js
function Er(e) {
	oi === null && (ri === null && ft(e), dt()), ti && ut(e);
}
function Dr(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Or(e, t) {
	var n = oi;
	n !== null && n.f & 8192 && (e |= Ue);
	var r = {
		ctx: Bt,
		deps: null,
		nodes: null,
		f: e | Ve | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	pn?.register_created_effect(r);
	var i = r;
	if (e & 4) yn === null ? Cn.ensure().schedule(r) : yn.push(r);
	else if (t !== null) {
		try {
			wi(r);
		} catch (e) {
			throw Gr(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= qe));
	}
	if (i !== null && (i.parent = n, n !== null && Dr(i, n), ri !== null && ri.f & 2 && !(e & 64))) {
		var a = ri;
		(a.effects ??= []).push(i);
	}
	return r;
}
function kr() {
	return ri !== null && !ii;
}
function Ar(e) {
	let t = Or(8, null);
	return an(t, Be), t.teardown = e, t;
}
function jr(e) {
	Er("$effect");
	var t = oi.f;
	if (!ri && t & 32 && !(t & 32768)) {
		var n = Bt;
		(n.e ??= []).push(e);
	} else return Mr(e);
}
function Mr(e) {
	return Or(4 | Ye, e);
}
function Nr(e) {
	return Er("$effect.pre"), Or(8 | Ye, e);
}
function Pr(e) {
	Cn.ensure();
	let t = Or(64 | Je, e);
	return () => {
		Gr(t);
	};
}
function Fr(e) {
	Cn.ensure();
	let t = Or(64 | Je, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Jr(t, () => {
			Gr(t), n(void 0);
		}) : (Gr(t), n(void 0));
	});
}
function Ir(e) {
	return Or(4, e);
}
function Lr(e) {
	return Or($e | Je, e);
}
function Rr(e, t = 0) {
	return Or(8 | t, e);
}
function N(e, t = [], n = [], r = []) {
	Ln(r, t, n, (t) => {
		Or(8, () => e(...t.map(P)));
	});
}
function zr(e, t = 0) {
	return Or(16 | t, e);
}
function Br(e, t = 0) {
	return Or(ze | t, e);
}
function Vr(e) {
	return Or(32 | Je, e);
}
function Hr(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = ti, n = ri;
		ni(!0), ai(null);
		try {
			t.call(null);
		} finally {
			ni(e), ai(n);
		}
	}
}
function Ur(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && wr(() => {
			e.abort(it);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Gr(n, t), n = r;
	}
}
function Wr(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Gr(t), t = n;
	}
}
function Gr(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Kr(e.nodes.start, e.nodes.end), n = !0), an(e, Ke), Ur(e, t && !n), Ci(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Hr(e), e.f ^= Ke, e.f |= We;
	var i = e.parent;
	i !== null && i.first !== null && qr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Kr(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ hr(e);
		e.remove(), e = n;
	}
}
function qr(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Jr(e, t, n = !0) {
	var r = [];
	Yr(e, r, !0);
	var i = () => {
		n && Gr(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Yr(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= Ue;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = (i.f & 65536) != 0 || (i.f & 32) != 0 && (e.f & 16) != 0;
				Yr(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Xr(e) {
	Zr(e, !0);
}
function Zr(e, t) {
	if (e.f & 8192) {
		e.f ^= Ue, e.f & 1024 || (an(e, Ve), Cn.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = (n.f & 65536) != 0 || (n.f & 32) != 0;
			Zr(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Qr(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ hr(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/legacy.js
var $r = null, ei = !1, ti = !1;
function ni(e) {
	ti = e;
}
var ri = null, ii = !1;
function ai(e) {
	ri = e;
}
var oi = null;
function si(e) {
	oi = e;
}
var ci = null;
function li(e) {
	ri !== null && (!Pt || ri.f & 2) && (ci === null ? ci = [e] : ci.push(e));
}
var ui = null, di = 0, fi = null;
function pi(e) {
	fi = e;
}
var mi = 1, hi = 0, gi = hi;
function _i(e) {
	gi = e;
}
function vi() {
	return ++mi;
}
function yi(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~Ze), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (yi(a) && Kn(a), a.wv > e.wv) return !0;
		}
		t & 512 && hn === null && an(e, Be);
	}
	return !1;
}
function bi(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(!Pt && ci !== null && we.call(ci, e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? bi(a, t, !1) : t === a && (n ? an(a, Ve) : a.f & 1024 && an(a, He), An(a));
	}
}
function xi(e) {
	var t = ui, n = di, r = fi, i = ri, a = ci, o = Bt, s = ii, c = gi, l = e.f;
	ui = null, di = 0, fi = null, ri = l & 96 ? null : e, ci = null, Vt(e.ctx), ii = !1, gi = ++hi, e.ac !== null && (wr(() => {
		e.ac.abort(it);
	}), e.ac = null);
	try {
		e.f |= Qe;
		var u = e.fn, d = u();
		e.f |= Ge;
		var f = e.deps, p = pn?.is_fork;
		if (ui !== null) {
			var m;
			if (p || Ci(e, di), f !== null && di > 0) for (f.length = di + ui.length, m = 0; m < ui.length; m++) f[di + m] = ui[m];
			else e.deps = f = ui;
			if (kr() && e.f & 512) for (m = di; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && di < f.length && (Ci(e, di), f.length = di);
		if (Jt() && fi !== null && !ii && f !== null && !(e.f & 6146)) for (m = 0; m < fi.length; m++) bi(fi[m], e);
		if (i !== null && i !== e) {
			if (hi++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = hi;
			if (t !== null) for (let e of t) e.rv = hi;
			fi !== null && (r === null ? r = fi : r.push(...fi));
		}
		return e.f & 8388608 && (e.f ^= et), d;
	} catch (e) {
		return tn(e);
	} finally {
		e.f ^= Qe, ui = t, di = n, fi = r, ri = i, ci = a, Vt(o), ii = s, gi = c;
	}
}
function Si(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = Ce.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (ui === null || !we.call(ui, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512, a.f &= ~Ze), a.v !== ve && on(a), qn(a), Ci(a, 0);
	}
}
function Ci(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Si(e, n[r]);
}
function wi(e) {
	var t = e.f;
	if (!(t & 16384)) {
		an(e, Be);
		var n = oi, r = ei;
		oi = e, ei = !0;
		try {
			t & 16777232 ? Wr(e) : Ur(e), Hr(e);
			var i = xi(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = mi;
		} finally {
			ei = r, oi = n;
		}
	}
}
async function Ti() {
	if (Pt) return new Promise((e) => {
		requestAnimationFrame(() => e()), setTimeout(() => e());
	});
	await Promise.resolve(), wn();
}
function P(e) {
	var t = (e.f & 2) != 0;
	if ($r?.add(e), ri !== null && !ii && !(oi !== null && oi.f & 16384) && (ci === null || !we.call(ci, e))) {
		var n = ri.deps;
		if (ri.f & 2097152) e.rv < hi && (e.rv = hi, ui === null && n !== null && n[di] === e ? di++ : ui === null ? ui = [e] : ui.push(e));
		else {
			(ri.deps ??= []).push(e);
			var r = e.reactions;
			r === null ? e.reactions = [ri] : we.call(r, ri) || r.push(ri);
		}
	}
	if (ti && Xn.has(e)) return Xn.get(e);
	if (t) {
		var i = e;
		if (ti) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Di(i)) && (a = Gn(i)), Xn.set(i, a), a;
		}
		var o = (i.f & 512) == 0 && !ii && ri !== null && (ei || (ri.f & 512) != 0), s = (i.f & Ge) === 0;
		yi(i) && (o && (i.f |= 512), Kn(i)), o && !s && (Jn(i), Ei(i));
	}
	if (hn?.has(e)) return hn.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Ei(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Jn(t), Ei(t));
}
function Di(e) {
	if (e.v === ve) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Xn.has(t) || t.f & 2 && Di(t)) return !0;
	return !1;
}
function Oi(e) {
	var t = ii;
	try {
		return ii = !0, e();
	} finally {
		ii = t;
	}
}
function ki(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (tt in e) Ai(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && tt in n && Ai(n);
		}
	}
}
function Ai(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Ai(e[n], t);
		} catch {}
		let n = je(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = Oe(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/events.js
var ji = Symbol("events"), Mi = /* @__PURE__ */ new Set(), Ni = /* @__PURE__ */ new Set();
function Pi(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Bi.call(t, e), !e.cancelBubble) return wr(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? $t(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Fi(e, t, n, r = {}) {
	var i = Pi(t, e, n, r);
	return () => {
		e.removeEventListener(t, i, r);
	};
}
function Ii(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Pi(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Ar(() => {
		t.removeEventListener(e, o, a);
	});
}
function Li(e, t, n) {
	(t[ji] ??= {})[e] = n;
}
function Ri(e) {
	for (var t = 0; t < e.length; t++) Mi.add(e[t]);
	for (var n of Ni) n(e);
}
var zi = null;
function Bi(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	zi = e;
	var o = 0, s = zi === e && e[ji];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[ji] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		Ee(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = ri, d = oi;
		ai(null), si(null);
		try {
			for (var f, p = []; a !== null;) {
				var m = a.assignedSlot || a.parentNode || a.host || null;
				try {
					var h = a[ji]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					f ? p.push(e) : f = e;
				}
				if (e.cancelBubble || m === t || m === null) break;
				a = m;
			}
			if (f) {
				for (let e of p) queueMicrotask(() => {
					throw e;
				});
				throw f;
			}
		} finally {
			e[ji] = t, delete e.currentTarget, ai(u), si(d);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/reconciler.js
var Vi = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Hi(e) {
	return Vi?.createHTML(e) ?? e;
}
function Ui(e) {
	var t = vr("template");
	return t.innerHTML = Hi(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/template.js
function Wi(e, t) {
	var n = oi;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/* @__NO_SIDE_EFFECTS__ */
function F(e, t) {
	var n = (t & 1) != 0, r = (t & 2) != 0, i, a = !e.startsWith("<!>");
	return () => {
		if (T) return Wi(Tt, null), Tt;
		i === void 0 && (i = Ui(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ mr(i)));
		var t = r || lr ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ mr(t), s = t.lastChild;
			Wi(o, s);
		} else Wi(t, t);
		return t;
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Gi(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = (t & 1) != 0, a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (T) return Wi(Tt, null), Tt;
		if (!o) {
			var e = /* @__PURE__ */ mr(Ui(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ mr(e);) o.appendChild(/* @__PURE__ */ mr(e));
			else o = /* @__PURE__ */ mr(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ mr(t), r = t.lastChild;
			Wi(n, r);
		} else Wi(t, t);
		return t;
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Ki(e, t) {
	return /* @__PURE__ */ Gi(e, t, "svg");
}
function qi(e = "") {
	if (!T) {
		var t = pr(e + "");
		return Wi(t, t), t;
	}
	var n = Tt;
	return n.nodeType === 3 ? yr(n) : (n.before(n = pr()), Et(n)), Wi(n, n), n;
}
function Ji() {
	if (T) return Wi(Tt, null), Tt;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = pr();
	return e.append(t, n), Wi(t, n), e;
}
function I(e, t) {
	if (T) {
		var n = oi;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = Tt), Dt();
		return;
	}
	e !== null && e.before(t);
}
function Yi(e) {
	return e.endsWith("capture") && e !== "gotpointercapture" && e !== "lostpointercapture";
}
var Xi = [
	"beforeinput",
	"click",
	"change",
	"dblclick",
	"contextmenu",
	"focusin",
	"focusout",
	"input",
	"keydown",
	"keyup",
	"mousedown",
	"mousemove",
	"mouseout",
	"mouseover",
	"mouseup",
	"pointerdown",
	"pointermove",
	"pointerout",
	"pointerover",
	"pointerup",
	"touchend",
	"touchmove",
	"touchstart"
];
function Zi(e) {
	return Xi.includes(e);
}
var Qi = /* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split("."), $i = {
	formnovalidate: "formNoValidate",
	ismap: "isMap",
	nomodule: "noModule",
	playsinline: "playsInline",
	readonly: "readOnly",
	defaultvalue: "defaultValue",
	defaultchecked: "defaultChecked",
	srcobject: "srcObject",
	novalidate: "noValidate",
	allowfullscreen: "allowFullscreen",
	disablepictureinpicture: "disablePictureInPicture",
	disableremoteplayback: "disableRemotePlayback"
};
function ea(e) {
	return e = e.toLowerCase(), $i[e] ?? e;
}
[...Qi];
var ta = ["touchstart", "touchmove"];
function na(e) {
	return ta.includes(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/render.js
var ra = !0;
function ia(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e.__t ??= e.nodeValue) && (e.__t = n, e.nodeValue = `${n}`);
}
function aa(e, t) {
	return sa(e, t);
}
var oa = /* @__PURE__ */ new Map();
function sa(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	fr();
	var c = void 0, l = Fr(() => {
		var l = n ?? t.appendChild(pr());
		Fn(l, { pending: () => {} }, (t) => {
			Kt({});
			var n = Bt;
			if (a && (n.c = a), i && (r.$$events = i), T && Wi(t, null), ra = o, c = e(t, r) || {}, ra = !0, T && (oi.nodes.end = Tt, Tt === null || Tt.nodeType !== 8 || Tt.data !== "]")) throw xt(), _e;
			qt();
		}, s);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = na(r);
					for (let e of [t, document]) {
						var a = oa.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), oa.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Bi, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(Te(Mi)), Ni.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = oa.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Bi), r.delete(e), r.size === 0 && oa.delete(n)) : r.set(e, i);
			}
			Ni.delete(d), l !== n && l.parentNode?.removeChild(l);
		};
	});
	return ca.set(c, l), c;
}
var ca = /* @__PURE__ */ new WeakMap();
function la(e, t) {
	let n = ca.get(e);
	return n ? (ca.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/blocks/branches.js
var ua = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) Xr(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Gr(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Qr(r, t), t.append(pr()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Gr(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Jr(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Gr(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = pn, r = _r();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = pr();
			i.append(a), this.#n.set(e, {
				effect: Vr(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Vr(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else T && (this.anchor = Tt), this.#a(n);
	}
};
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function da(e, t, ...n) {
	var r = new ua(e);
	zr(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, qe);
}
function fa(e) {
	Bt === null && ot("onMount"), Ft && Bt.l !== null ? ma(Bt).m.push(e) : jr(() => {
		let t = Oi(e);
		if (typeof t == "function") return t;
	});
}
function pa(e) {
	Bt === null && ot("onDestroy"), fa(() => () => Oi(e));
}
function ma(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/blocks/await.js
var ha = 0, ga = 1, _a = 2;
function va(e, t, n, r, i) {
	T && Dt();
	var a = Jt(), o = ve, s = a ? Qn(o) : /* @__PURE__ */ $n(o, !1, !1), c = a ? Qn(o) : /* @__PURE__ */ $n(o, !1, !1), l = new ua(e);
	zr(() => {
		var a = pn;
		a.deactivate();
		var o = t();
		a.activate();
		var u = !1;
		let d = T && Fe(o) === (e.data === "[!");
		if (d && (Et(kt()), wt(!1)), Fe(o)) {
			var f = Rn(), p = !1;
			let e = (e) => {
				if (!u) {
					p = !0, f(!1), Cn.ensure(), T && wt(!1);
					try {
						e();
					} finally {
						zn(!1), _n || wn();
					}
				}
			};
			o.then((t) => {
				e(() => {
					er(s, t), l.ensure(ga, r && ((e) => r(e, s)));
				});
			}, (t) => {
				e(() => {
					if (er(c, t), l.ensure(_a, i && ((e) => i(e, c))), !i) throw c.v;
				});
			}), T ? l.ensure(ha, n) : $t(() => {
				p || e(() => {
					l.ensure(ha, n);
				});
			});
		} else er(s, o), l.ensure(ga, r && ((e) => r(e, s)));
		return d && wt(!0), () => {
			u = !0;
		};
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/blocks/if.js
function L(e, t, n = !1) {
	var r;
	T && (r = Tt, Dt());
	var i = new ua(e), a = n ? qe : 0;
	function o(e, t) {
		if (T) {
			var n = At(r);
			if (e !== parseInt(n.substring(1))) {
				var a = kt();
				Et(a), i.anchor = a, wt(!1), i.ensure(e, t), wt(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	zr(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/blocks/each.js
function ya(e, t) {
	return t;
}
function ba(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Jr(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					xa(e, Te(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null;
		if (c) {
			var l = n, u = l.parentNode;
			gr(u), u.append(l), e.items.clear();
		}
		xa(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function xa(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= Xe, Qr(a, document.createDocumentFragment())) : Gr(t[i], n);
	}
}
var Sa;
function Ca(e, t, n, r, i, a = null) {
	var o = e, s = /* @__PURE__ */ new Map();
	if (t & 4) {
		var c = e;
		o = T ? Et(/* @__PURE__ */ mr(c)) : c.appendChild(pr());
	}
	T && Dt();
	var l = null, u = /* @__PURE__ */ Un(() => {
		var e = n();
		return Se(e) ? e : e == null ? [] : Te(e);
	}), d, f = /* @__PURE__ */ new Map(), p = !0;
	function m(e) {
		g.effect.f & 16384 || (g.pending.delete(e), g.fallback = l, Ta(g, d, o, t, r), l !== null && (d.length === 0 ? l.f & 33554432 ? (l.f ^= Xe, Da(l, null, o)) : Xr(l) : Jr(l, () => {
			l = null;
		})));
	}
	function h(e) {
		g.pending.delete(e);
	}
	var g = {
		effect: zr(() => {
			d = P(u);
			var e = d.length;
			let c = !1;
			T && At(o) === "[!" != (e === 0) && (o = kt(), Et(o), wt(!1), c = !0);
			for (var g = /* @__PURE__ */ new Set(), _ = pn, v = _r(), y = 0; y < e; y += 1) {
				T && Tt.nodeType === 8 && Tt.data === "]" && (o = Tt, c = !0, wt(!1));
				var b = d[y], x = r(b, y), ee = p ? null : s.get(x);
				ee ? (ee.v && er(ee.v, b), ee.i && er(ee.i, y), v && _.unskip_effect(ee.e)) : (ee = Ea(s, p ? o : Sa ??= pr(), b, x, y, i, t, n), p || (ee.e.f |= Xe), s.set(x, ee)), g.add(x);
			}
			if (e === 0 && a && !l && (p ? l = Vr(() => a(o)) : (l = Vr(() => a(Sa ??= pr())), l.f |= Xe)), e > g.size && lt("", "", ""), T && e > 0 && Et(kt()), !p) if (f.set(_, g), v) {
				for (let [e, t] of s) g.has(e) || _.skip_effect(t.e);
				_.oncommit(m), _.ondiscard(h);
			} else m(_);
			c && wt(!0), P(u);
		}),
		flags: t,
		items: s,
		pending: f,
		outrogroups: null,
		fallback: l
	};
	p = !1, T && (o = Tt);
}
function wa(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Ta(e, t, n, r, i) {
	var a = (r & 8) != 0, o = t.length, s = e.items, c = wa(e.effect.first), l, u = null, d, f = [], p = [], m, h, g, _;
	if (a) for (_ = 0; _ < o; _ += 1) m = t[_], h = i(m, _), g = s.get(h).e, g.f & 33554432 || (g.nodes?.a?.measure(), (d ??= /* @__PURE__ */ new Set()).add(g));
	for (_ = 0; _ < o; _ += 1) {
		if (m = t[_], h = i(m, _), g = s.get(h).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(g), t.done.delete(g);
		if (g.f & 8192 && (Xr(g), a && (g.nodes?.a?.unfix(), (d ??= /* @__PURE__ */ new Set()).delete(g))), g.f & 33554432) if (g.f ^= Xe, g === c) Da(g, null, n);
		else {
			var v = u ? u.next : c;
			g === e.effect.last && (e.effect.last = g.prev), g.prev && (g.prev.next = g.next), g.next && (g.next.prev = g.prev), Oa(e, u, g), Oa(e, g, v), Da(g, v, n), u = g, f = [], p = [], c = wa(u.next);
			continue;
		}
		if (g !== c) {
			if (l !== void 0 && l.has(g)) {
				if (f.length < p.length) {
					var y = p[0], b;
					u = y.prev;
					var x = f[0], ee = f[f.length - 1];
					for (b = 0; b < f.length; b += 1) Da(f[b], y, n);
					for (b = 0; b < p.length; b += 1) l.delete(p[b]);
					Oa(e, x.prev, ee.next), Oa(e, u, x), Oa(e, ee, y), c = y, u = ee, --_, f = [], p = [];
				} else l.delete(g), Da(g, c, n), Oa(e, g.prev, g.next), Oa(e, g, u === null ? e.effect.first : u.next), Oa(e, u, g), u = g;
				continue;
			}
			for (f = [], p = []; c !== null && c !== g;) (l ??= /* @__PURE__ */ new Set()).add(c), p.push(c), c = wa(c.next);
			if (c === null) continue;
		}
		g.f & 33554432 || f.push(g), u = g, c = wa(g.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (xa(e, Te(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var S = [];
		if (l !== void 0) for (g of l) g.f & 8192 || S.push(g);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && S.push(c), c = wa(c.next);
		var C = S.length;
		if (C > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (_ = 0; _ < C; _ += 1) S[_].nodes?.a?.measure();
				for (_ = 0; _ < C; _ += 1) S[_].nodes?.a?.fix();
			}
			ba(e, S, te);
		}
	}
	a && $t(() => {
		if (d !== void 0) for (g of d) g.nodes?.a?.apply();
	});
}
function Ea(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Qn(n) : /* @__PURE__ */ $n(n, !1, !1) : null, l = o & 2 ? Qn(i) : null;
	return {
		v: c,
		i: l,
		e: Vr(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Da(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ hr(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Oa(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function ka(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		T && (o = Et(/* @__PURE__ */ mr(c)));
	}
	N(() => {
		var e = oi;
		if (s === (s = t() ?? "")) {
			T && Dt();
			return;
		}
		if (n && !T) {
			e.nodes = null, c.innerHTML = s, s !== "" && Wi(/* @__PURE__ */ mr(c), c.lastChild);
			return;
		}
		if (e.nodes !== null && (Kr(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (T) {
				for (var a = Tt.data, l = Dt(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ hr(l);
				if (l === null) throw xt(), _e;
				Wi(Tt, u), o = Et(l);
				return;
			}
			var d = vr(r ? "svg" : i ? "math" : "template", r ? be : i ? xe : void 0);
			d.innerHTML = s;
			var f = r || i ? d : d.content;
			if (Wi(/* @__PURE__ */ mr(f), f.lastChild), r || i) for (; /* @__PURE__ */ mr(f);) o.before(/* @__PURE__ */ mr(f));
			else o.before(f);
		}
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function Aa(e, t, n) {
	var r;
	T && (r = Tt, Dt());
	var i = new ua(e);
	zr(() => {
		var e = t() ?? null;
		if (T && At(r) === "[" != (e !== null)) {
			var a = kt();
			Et(a), i.anchor = a, wt(!1), i.ensure(e, e && ((t) => n(t, e))), wt(!0);
			return;
		}
		i.ensure(e, e && ((t) => n(t, e)));
	}, qe);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/timing.js
var ja = () => performance.now(), Ma = {
	tick: (e) => requestAnimationFrame(e),
	now: () => ja(),
	tasks: /* @__PURE__ */ new Set()
};
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/loop.js
function Na() {
	let e = Ma.now();
	Ma.tasks.forEach((t) => {
		t.c(e) || (Ma.tasks.delete(t), t.f());
	}), Ma.tasks.size !== 0 && Ma.tick(Na);
}
function Pa(e) {
	let t;
	return Ma.tasks.size === 0 && Ma.tick(Na), {
		promise: new Promise((n) => {
			Ma.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			Ma.tasks.delete(t);
		}
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/transitions.js
function Fa(e, t) {
	wr(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function Ia(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function La(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = Ia(n.trim());
		t[i] = r.trim();
	}
	return t;
}
var Ra = (e) => e, za = null;
function Ba(e, t, n) {
	var r = (za ?? oi).nodes, i, a, o, s = null;
	r.a ??= {
		element: e,
		measure() {
			i = this.element.getBoundingClientRect();
		},
		apply() {
			if (o?.abort(), a = this.element.getBoundingClientRect(), i.left !== a.left || i.right !== a.right || i.top !== a.top || i.bottom !== a.bottom) {
				let e = t()(this.element, {
					from: i,
					to: a
				}, n?.());
				o = Ha(this.element, e, void 0, 1, () => {
					o?.abort(), o = void 0;
				});
			}
		},
		fix() {
			if (!e.getAnimations().length) {
				var { position: t, width: n, height: r } = getComputedStyle(e);
				if (t !== "absolute" && t !== "fixed") {
					var a = e.style;
					s = {
						position: a.position,
						width: a.width,
						height: a.height,
						transform: a.transform
					}, a.position = "absolute", a.width = n, a.height = r;
					var o = e.getBoundingClientRect();
					if (i.left !== o.left || i.top !== o.top) {
						var c = `translate(${i.left - o.left}px, ${i.top - o.top}px)`;
						a.transform = a.transform ? `${a.transform} ${c}` : c;
					}
				}
			}
		},
		unfix() {
			if (s) {
				var t = e.style;
				t.position = s.position, t.width = s.width, t.height = s.height, t.transform = s.transform;
			}
		}
	}, r.a.element = e;
}
function Va(e, t, n, r) {
	var i = (e & 1) != 0, a = (e & 2) != 0, o = i && a, s = (e & 4) != 0, c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return wr(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			if (t.inert = u, !i) {
				p?.abort(), p?.reset?.();
				return;
			}
			a || f?.abort(), f = Ha(t, m(), p, 1, () => {
				Fa(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			});
		},
		out(e) {
			if (!a) {
				e?.(), l = void 0;
				return;
			}
			t.inert = !0, p = Ha(t, m(), f, 0, () => {
				Fa(t, "outroend"), e?.();
			});
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = oi;
	if ((g.nodes.t ??= []).push(h), i && ra) {
		var _ = s;
		if (!_) {
			for (var v = g.parent; v && v.f & 65536;) for (; (v = v.parent) && !(v.f & 16););
			_ = !v || (v.f & 32768) != 0;
		}
		_ && Ir(() => {
			Oi(() => h.in());
		});
	}
}
function Ha(e, t, n, r, i) {
	var a = r === 1;
	if (Ne(t)) {
		var o, s = !1;
		return $t(() => {
			s || (o = Ha(e, t({ direction: a ? "in" : "out" }), n, r, i));
		}), {
			abort: () => {
				s = !0, o?.abort();
			},
			deactivate: () => o.deactivate(),
			reset: () => o.reset(),
			t: () => o.t()
		};
	}
	if (n?.deactivate(), !t?.duration && !t?.delay) return Fa(e, a ? "introstart" : "outrostart"), i(), {
		abort: Pe,
		deactivate: Pe,
		reset: Pe,
		t: () => r
	};
	let { delay: c = 0, css: l, tick: u, easing: d = Ra } = t;
	var f = [];
	if (a && n === void 0 && (u && u(0, 1), l)) {
		var p = La(l(0, 1));
		f.push(p, p);
	}
	var m = () => 1 - r, h = e.animate(f, {
		duration: c,
		fill: "forwards"
	});
	return h.onfinish = () => {
		h.cancel(), Fa(e, a ? "introstart" : "outrostart");
		var o = n?.t() ?? 1 - r;
		n?.abort();
		var s = r - o, c = t.duration * Math.abs(s), f = [];
		if (c > 0) {
			var p = !1;
			if (l) for (var g = Math.ceil(c / (1e3 / 60)), _ = 0; _ <= g; _ += 1) {
				var v = o + s * d(_ / g), y = La(l(v, 1 - v));
				f.push(y), p ||= y.overflow === "hidden";
			}
			p && (e.style.overflow = "hidden"), m = () => {
				var e = h.currentTime;
				return o + s * d(e / c);
			}, u && Pa(() => {
				if (h.playState !== "running") return !1;
				var e = m();
				return u(e, 1 - e), !0;
			});
		}
		h = e.animate(f, {
			duration: c,
			fill: "forwards"
		}), h.onfinish = () => {
			m = () => r, u?.(r, 1 - r), i();
		};
	}, {
		abort: () => {
			h && (h.cancel(), h.effect = null, h.onfinish = Pe);
		},
		deactivate: () => {
			i = Pe;
		},
		reset: () => {
			r === 0 && u?.(1, 0);
		},
		t: () => m()
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/actions.js
function Ua(e, t, n) {
	Ir(() => {
		var r = Oi(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Rr(() => {
				var e = n();
				ki(e), i && Mt(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Wa(e, t) {
	var n = void 0, r;
	Br(() => {
		n !== (n = t()) && (r &&= (Gr(r), null), n && (r = Vr(() => {
			Ir(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function Ga(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = Ga(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function Ka() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Ga(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/shared/attributes.js
function R(e) {
	return typeof e == "object" ? Ka(e) : e ?? "";
}
var qa = [..." 	\n\r\f\xA0\v﻿"];
function Ja(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || qa.includes(r[o - 1])) && (s === r.length || qa.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Ya(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Xa(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Za(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Xa)), i && c.push(...Object.keys(i).map(Xa));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Xa(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += Ya(r)), i && (n += Ya(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/class.js
function z(e, t, n, r, i, a) {
	var o = e.__className;
	if (T || o !== n || o === void 0) {
		var s = Ja(n, r, a);
		(!T || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e.__className = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/style.js
function Qa(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function $a(e, t, n, r) {
	var i = e.__style;
	if (T || i !== t) {
		var a = Za(t, r);
		(!T || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e.__style = t;
	} else r && (Array.isArray(r) ? (Qa(e, n?.[0], r[0]), Qa(e, n?.[1], r[1], "important")) : Qa(e, n, r));
	return r;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function eo(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!Se(t)) return St();
		for (var r of e.options) r.selected = t.includes(no(r));
		return;
	}
	for (r of e.options) if (or(no(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function to(e) {
	var t = new MutationObserver(() => {
		eo(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), Ar(() => {
		t.disconnect();
	});
}
function no(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ro = Symbol("class"), io = Symbol("style"), ao = Symbol("is custom element"), oo = Symbol("is html"), so = at ? "link" : "LINK", co = at ? "input" : "INPUT", lo = at ? "option" : "OPTION", uo = at ? "select" : "SELECT";
function fo(e) {
	if (T) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					mo(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					mo(e, "checked", null), e.checked = r;
				}
			}
		};
		e.__on_r = n, $t(n), Cr();
	}
}
function po(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function mo(e, t, n, r) {
	var i = go(e);
	T && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === so) || i[t] !== (i[t] = n) && (t === "loading" && (e[rt] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && vo(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function ho(e, t, n, r, i = !1, a = !1) {
	if (T && i && e.nodeName === co) {
		var o = e;
		(o.type === "checkbox" ? "defaultChecked" : "defaultValue") in n || fo(o);
	}
	var s = go(e), c = s[ao], l = !s[oo];
	let u = T && c;
	u && wt(!1);
	var d = t || {}, f = e.nodeName === lo;
	for (var p in t) p in n || (n[p] = null);
	n.class ? n.class = R(n.class) : (r || n[ro]) && (n.class = null), n[io] && (n.style ??= null);
	var m = vo(e);
	for (let i in n) {
		let o = n[i];
		if (f && i === "value" && o == null) {
			e.value = e.__value = "", d[i] = o;
			continue;
		}
		if (i === "class") {
			z(e, e.namespaceURI === "http://www.w3.org/1999/xhtml", o, r, t?.[ro], n[ro]), d[i] = o, d[ro] = n[ro];
			continue;
		}
		if (i === "style") {
			$a(e, o, t?.[io], n[io]), d[i] = o, d[io] = n[io];
			continue;
		}
		var h = d[i];
		if (!(o === h && !(o === void 0 && e.hasAttribute(i)))) {
			d[i] = o;
			var g = i[0] + i[1];
			if (g !== "$$") if (g === "on") {
				let t = {}, n = "$$" + i, r = i.slice(2);
				var _ = Zi(r);
				if (Yi(r) && (r = r.slice(0, -7), t.capture = !0), !_ && h) {
					if (o != null) continue;
					e.removeEventListener(r, d[n], t), d[n] = null;
				}
				if (_) Li(r, e, o), Ri([r]);
				else if (o != null) {
					function a(e) {
						d[i].call(this, e);
					}
					d[n] = Pi(r, e, a, t);
				}
			} else if (i === "style") mo(e, i, o);
			else if (i === "autofocus") br(e, !!o);
			else if (!c && (i === "__value" || i === "value" && o != null)) e.value = e.__value = o;
			else if (i === "selected" && f) po(e, o);
			else {
				var v = i;
				l || (v = ea(v));
				var y = v === "defaultValue" || v === "defaultChecked";
				if (o == null && !c && !y) if (s[i] = null, v === "value" || v === "checked") {
					let n = e, r = t === void 0;
					if (v === "value") {
						let e = n.defaultValue;
						n.removeAttribute(v), n.defaultValue = e, n.value = n.__value = r ? e : null;
					} else {
						let e = n.defaultChecked;
						n.removeAttribute(v), n.defaultChecked = e, n.checked = r ? e : !1;
					}
				} else e.removeAttribute(i);
				else y || m.includes(v) && (c || typeof o != "string") ? (e[v] = o, v in s && (s[v] = ve)) : typeof o != "function" && mo(e, v, o, a);
			}
		}
	}
	return u && wt(!0), d;
}
function B(e, t, n = [], r = [], i = [], a, o = !1, s = !1) {
	Ln(i, n, r, (n) => {
		var r = void 0, i = {}, c = e.nodeName === uo, l = !1;
		if (Br(() => {
			var u = t(...n.map(P)), d = ho(e, r, u, a, o, s);
			l && c && "value" in u && eo(e, u.value);
			for (let e of Object.getOwnPropertySymbols(i)) u[e] || Gr(i[e]);
			for (let t of Object.getOwnPropertySymbols(u)) {
				var f = u[t];
				t.description === "@attach" && (!r || f !== r[t]) && (i[t] && Gr(i[t]), i[t] = Vr(() => Wa(e, () => f))), d[t] = f;
			}
			r = d;
		}), c) {
			var u = e;
			Ir(() => {
				eo(u, r.value, !0), to(u);
			});
		}
		l = !0;
	});
}
function go(e) {
	return e.__attributes ??= {
		[ao]: e.nodeName.includes("-"),
		[oo]: e.namespaceURI === ye
	};
}
var _o = /* @__PURE__ */ new Map();
function vo(e) {
	var t = e.getAttribute("is") || e.nodeName, n = _o.get(t);
	if (n) return n;
	_o.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = Oe(i), r) r[o].set && n.push(o);
		i = je(i);
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function yo(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	Tr(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = bo(e) ? xo(a) : a, n(a), pn !== null && r.add(pn), await Ti(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (T && e.defaultValue !== e.value || Oi(t) == null && e.value) && (n(bo(e) ? xo(e.value) : e.value), pn !== null && r.add(pn)), Rr(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = Pt ? mn : pn;
			if (r.has(i)) return;
		}
		bo(e) && n === xo(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function bo(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function xo(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function So(e, t) {
	return e === t || e?.[tt] === t;
}
function Co(e = {}, t, n, r) {
	var i = Bt.r, a = oi;
	return Ir(() => {
		var o, s;
		return Rr(() => {
			o = s, s = r?.() || [], Oi(() => {
				e !== n(...s) && (t(e, ...s), o && So(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && So(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function wo(e = !1) {
	let t = Bt, n = t.l.u;
	if (!n) return;
	let r = () => ki(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ Vn(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => P(i);
	}
	n.b.length && Nr(() => {
		To(t, r), Le(n.b);
	}), jr(() => {
		let e = Oi(() => n.m.map(Ie));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && jr(() => {
		To(t, r), Le(n.a);
	});
}
function To(e, t) {
	if (e.l.s) for (let t of e.l.s) P(t);
	t();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/dom/legacy/misc.js
function Eo(e) {
	var t = Qn(0);
	return function() {
		return arguments.length === 1 ? (k(t, P(t) + 1), arguments[0]) : (P(t), e());
	};
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/client/reactivity/props.js
var Do = {
	get(e, t) {
		if (!e.exclude.includes(t)) return e.props[t];
	},
	set(e, t) {
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		if (!e.exclude.includes(t) && t in e.props) return {
			enumerable: !0,
			configurable: !0,
			value: e.props[t]
		};
	},
	has(e, t) {
		return e.exclude.includes(t) ? !1 : t in e.props;
	},
	ownKeys(e) {
		return Reflect.ownKeys(e.props).filter((t) => !e.exclude.includes(t));
	}
};
/* @__NO_SIDE_EFFECTS__ */
function V(e, t, n) {
	return new Proxy({
		props: e,
		exclude: t
	}, Do);
}
function H(e, t, n, r) {
	var i = !Ft || (n & 2) != 0, a = (n & 8) != 0, o = (n & 16) != 0, s = r, c = !0, l = () => (c && (c = !1, s = o ? Oi(r) : r), s);
	let u;
	if (a) {
		var d = tt in e || nt in e;
		u = De(e, t)?.set ?? (d && t in e ? (n) => e[t] = n : void 0);
	}
	var f, p = !1;
	a ? [f, p] = dn(() => e[t]) : f = e[t], f === void 0 && r !== void 0 && (f = l(), u && (i && mt(t), u(f)));
	var m = i ? () => {
		var n = e[t];
		return n === void 0 ? l() : (c = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return m;
	if (u) {
		var h = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || h || p) && u(t ? m() : e), e) : m();
		});
	}
	var g = !1, _ = (n & 1 ? Vn : Un)(() => (g = !1, m()));
	a && P(_);
	var v = oi;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? P(_) : i && a ? ir(e) : e;
			return k(_, n), g = !0, s !== void 0 && (s = n), e;
		}
		return ti && g || v.f & 16384 ? _.v : P(_);
	});
}
var Oo = /* @__PURE__ */ function(e) {
	return e.Light = "light", e.Dark = "dark", e.System = "system", e;
}({}), ko = /* @__PURE__ */ function(e) {
	return e[e.Default = 0] = "Default", e[e.Medium = .5] = "Medium", e[e.High = 1] = "High", e;
}({}), Ao = /* @__PURE__ */ function(e) {
	return e.Default = "default", e.Medium = "medium", e.High = "high", e;
}({}), jo = /* @__PURE__ */ function(e) {
	return e.Monochrome = "neutral", e.Yellow = "yellow", e.Amber = "amber", e.Orange = "orange", e.Blue = "blue", e.Cyan = "cyan", e.Green = "green", e.Purple = "purple", e.Pink = "pink", e.Red = "red", e.Teal = "teal", e.Custom = "custom", e;
}({}), Mo = /* @__PURE__ */ function(e) {
	return e[e.ExtraSmall = 12] = "ExtraSmall", e[e.Small = 14] = "Small", e[e.Normal = 16] = "Normal", e[e.Large = 18] = "Large", e[e.ExtraLarge = 20] = "ExtraLarge", e;
}({}), No = /* @__PURE__ */ function(e) {
	return e.Full = "full", e.Simple = "simple", e;
}({}), Po = /* @__PURE__ */ function(e) {
	return e.Vert = "vert", e.Horiz = "horiz", e;
}({}), Fo = /* @__PURE__ */ function(e) {
	return e.Off = "off", e.System = "system", e.On = "on", e;
}({}), Io = /* @__PURE__ */ function(e) {
	return e.Auto = "auto", e.Google = "google", e;
}({}), Lo = /* @__PURE__ */ function(e) {
	return e.GoogleTranslate = "google-translate", e.MyMemory = "mymemory", e.TranslatorApi = "translator-api", e;
}({}), Ro = "google-translate-free", zo = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = Nn(t);
	}
	get current() {
		return this.#t(), this.#e();
	}
}, Bo = /\(.+\)/, Vo = new Set([
	"all",
	"print",
	"screen",
	"and",
	"or",
	"not",
	"only"
]), Ho = class extends zo {
	constructor(e, t) {
		let n = Bo.test(e) || e.split(/[\s,]+/).some((e) => Vo.has(e.trim())) ? e : `(${e})`, r = window.matchMedia(n);
		super(() => r.matches, (e) => Fi(r, "change", e));
	}
}, Uo = {
	aa: "Afar",
	ab: "Abkhaz",
	ace: "Acehnese",
	ach: "Acholi",
	af: "Afrikaans",
	ak: "Twi (Akan)",
	alz: "Alur",
	am: "Amharic",
	ar: "Arabic",
	as: "Assamese",
	av: "Avar",
	awa: "Awadhi",
	ay: "Aymara",
	az: "Azerbaijani",
	ba: "Bashkir",
	bal: "Baluchi",
	ban: "Balinese",
	bbc: "Batak Toba",
	bci: "Baoulé",
	be: "Belarusian",
	bem: "Bemba",
	ber: "Tamazight (Tifinagh)",
	"ber-Latn": "Tamazight",
	bew: "Betawi",
	bg: "Bulgarian",
	bho: "Bhojpuri",
	bik: "Bikol",
	bm: "Bambara",
	"bm-Nkoo": "NKo",
	bn: "Bengali",
	bo: "Tibetan",
	br: "Breton",
	bs: "Bosnian",
	bts: "Batak Simalungun",
	btx: "Batak Karo",
	bua: "Buryat",
	ca: "Catalan",
	ce: "Chechen",
	ceb: "Cebuano",
	cgg: "Kiga",
	ch: "Chamorro",
	chk: "Chuukese",
	chm: "Meadow Mari",
	ckb: "Kurdish (Sorani)",
	cnh: "Hakha Chin",
	co: "Corsican",
	crh: "Crimean Tatar (Cyrillic)",
	"crh-Latn": "Crimean Tatar (Latin)",
	crs: "Seychellois Creole",
	cs: "Czech",
	cv: "Chuvash",
	cy: "Welsh",
	da: "Danish",
	de: "German",
	din: "Dinka",
	doi: "Dogri",
	dov: "Dombe",
	dv: "Dhivehi",
	dyu: "Dyula",
	dz: "Dzongkha",
	ee: "Ewe",
	el: "Greek",
	en: "English",
	eo: "Esperanto",
	es: "Spanish",
	et: "Estonian",
	eu: "Basque",
	fa: "Persian",
	"fa-AF": "Dari",
	ff: "Fulani",
	fi: "Finnish",
	fj: "Fijian",
	fil: "Filipino (Tagalog)",
	fo: "Faroese",
	fon: "Fon",
	fr: "French",
	"fr-CA": "French (Canada)",
	"fr-FR": "French (France)",
	fur: "Friulian",
	fy: "Frisian",
	ga: "Irish",
	gaa: "Ga",
	gd: "Scots Gaelic",
	gl: "Galician",
	gn: "Guarani",
	gom: "Konkani",
	gu: "Gujarati",
	gv: "Manx",
	ha: "Hausa",
	haw: "Hawaiian",
	hi: "Hindi",
	hil: "Hiligaynon",
	hmn: "Hmong",
	hr: "Croatian",
	hrx: "Hunsrik",
	ht: "Haitian Creole",
	hu: "Hungarian",
	hy: "Armenian",
	iba: "Iban",
	id: "Indonesian",
	ig: "Igbo",
	ilo: "Ilocano",
	is: "Icelandic",
	it: "Italian",
	iu: "Inuktut (Syllabics)",
	"iu-Latn": "Inuktut (Latin)",
	iw: "Hebrew",
	ja: "Japanese",
	jam: "Jamaican Patois",
	jw: "Javanese",
	ka: "Georgian",
	kac: "Jingpo",
	kek: "Qʼeqchiʼ",
	kg: "Kikongo",
	kha: "Khasi",
	kk: "Kazakh",
	kl: "Kalaallisut",
	km: "Khmer",
	kn: "Kannada",
	ko: "Korean",
	kr: "Kanuri",
	kri: "Krio",
	ktu: "Kituba",
	ku: "Kurdish (Kurmanji)",
	kv: "Komi",
	ky: "Kyrgyz",
	la: "Latin",
	lb: "Luxembourgish",
	lg: "Luganda",
	li: "Limburgish",
	lij: "Ligurian",
	lmo: "Lombard",
	ln: "Lingala",
	lo: "Lao",
	lt: "Lithuanian",
	ltg: "Latgalian",
	lua: "Tshiluba",
	luo: "Luo",
	lus: "Mizo",
	lv: "Latvian",
	mad: "Madurese",
	mai: "Maithili",
	mak: "Makassar",
	mam: "Mam",
	mfe: "Mauritian Creole",
	mg: "Malagasy",
	mh: "Marshallese",
	mi: "Maori",
	min: "Minang",
	mk: "Macedonian",
	ml: "Malayalam",
	mn: "Mongolian",
	"mni-Mtei": "Meiteilon (Manipuri)",
	mr: "Marathi",
	ms: "Malay",
	"ms-Arab": "Malay (Jawi)",
	mt: "Maltese",
	mwr: "Marwadi",
	my: "Myanmar (Burmese)",
	"ndc-ZW": "Ndau",
	ne: "Nepali",
	new: "Nepalbhasa (Newari)",
	nhe: "Nahuatl (Eastern Huasteca)",
	nl: "Dutch",
	no: "Norwegian",
	nr: "Ndebele (South)",
	nso: "Sepedi",
	nus: "Nuer",
	ny: "Chichewa",
	oc: "Occitan",
	om: "Oromo",
	or: "Odia (Oriya)",
	os: "Ossetian",
	pa: "Punjabi (Gurmukhi)",
	"pa-Arab": "Punjabi (Shahmukhi)",
	pag: "Pangasinan",
	pam: "Kapampangan",
	pap: "Papiamento",
	pl: "Polish",
	ps: "Pashto",
	pt: "Portuguese",
	"pt-BR": "Portuguese (Brazil)",
	"pt-PT": "Portuguese (Portugal)",
	qu: "Quechua",
	rn: "Rundi",
	ro: "Romanian",
	rom: "Romani",
	ru: "Russian",
	rw: "Kinyarwanda",
	sa: "Sanskrit",
	sah: "Yakut",
	sat: "Santali (Ol Chiki)",
	"sat-Latn": "Santali (Latin)",
	scn: "Sicilian",
	sd: "Sindhi",
	se: "Sami (North)",
	sg: "Sango",
	shn: "Shan",
	si: "Sinhala",
	sk: "Slovak",
	sl: "Slovenian",
	sm: "Samoan",
	sn: "Shona",
	so: "Somali",
	sq: "Albanian",
	sr: "Serbian",
	ss: "Swati",
	st: "Sesotho",
	su: "Sundanese",
	sus: "Susu",
	sv: "Swedish",
	sw: "Swahili",
	szl: "Silesian",
	ta: "Tamil",
	tcy: "Tulu",
	te: "Telugu",
	tet: "Tetum",
	tg: "Tajik",
	th: "Thai",
	ti: "Tigrinya",
	tiv: "Tiv",
	tk: "Turkmen",
	tl: "Filipino",
	tn: "Tswana",
	to: "Tongan",
	tpi: "Tok Pisin",
	tr: "Turkish",
	trp: "Kokborok",
	ts: "Tsonga",
	tt: "Tatar",
	tum: "Tumbuka",
	ty: "Tahitian",
	tyv: "Tuvan",
	udm: "Udmurt",
	ug: "Uyghur",
	uk: "Ukrainian",
	ur: "Urdu",
	uz: "Uzbek",
	ve: "Venda",
	vec: "Venetian",
	vi: "Vietnamese",
	war: "Waray",
	wo: "Wolof",
	xh: "Xhosa",
	yi: "Yiddish",
	yo: "Yoruba",
	yua: "Yucatec Maya",
	yue: "Cantonese",
	zap: "Zapotec",
	"zh-CN": "Chinese (Simplified)",
	"zh-TW": "Chinese (Traditional)",
	zu: "Zulu"
}, Wo = Object.keys(Uo).reduce((e, t) => (e[t] = l.i18n.getMessage(`language_${t.replace("-", "_")}`).toLowerCase(), e), {}), Go = Object.entries(Wo).map(([e, t]) => ({
	code: e,
	language: t
})).sort((e, t) => e.language.localeCompare(t.language)), Ko = {
	code: "auto",
	language: l.i18n.getMessage("language_detect")
};
function qo(e) {
	if (Uo[e]) return e;
	let t = e.split("-")[0];
	if (Uo[t]) return t;
}
function Jo() {
	return qo(l.i18n.getUILanguage()) ?? "en";
}
function Yo(e, t = "name") {
	if (t === "code") return e;
	let n = qo(e);
	if (n) {
		let e = Wo[n];
		return t === "name+code" ? `${e} [${n}]` : e;
	}
	return e;
}
//#endregion
//#region src/shared/storage.svelte.ts
var Xo = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	t.exports = function e(t, n) {
		if (t === n) return !0;
		if (t && n && typeof t == "object" && typeof n == "object") {
			if (t.constructor !== n.constructor) return !1;
			var r, i, a;
			if (Array.isArray(t)) {
				if (r = t.length, r != n.length) return !1;
				for (i = r; i-- !== 0;) if (!e(t[i], n[i])) return !1;
				return !0;
			}
			if (t.constructor === RegExp) return t.source === n.source && t.flags === n.flags;
			if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === n.valueOf();
			if (t.toString !== Object.prototype.toString) return t.toString() === n.toString();
			if (a = Object.keys(t), r = a.length, r !== Object.keys(n).length) return !1;
			for (i = r; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(n, a[i])) return !1;
			for (i = r; i-- !== 0;) {
				var o = a[i];
				if (!e(t[o], n[o])) return !1;
			}
			return !0;
		}
		return t !== t && n !== n;
	};
})))(), 1), Zo = {
	theme: Oo.System,
	accentColor: jo.Blue,
	seedColor: "#6750A4",
	customTheme: ge,
	contrastLevel: ko.Default,
	fontSize: Mo.Normal,
	sourceLang: "auto",
	targetLang: Jo(),
	pinedLangs: [],
	inlineButtonShow: !0,
	textFieldButtonShow: !0,
	showTransliteration: !0,
	blacklistDomainForInline: [],
	blacklistDomainForText: [],
	historyEnable: !0,
	historyLength: 100,
	lockWindow: !1,
	ttsVoiceByLang: {},
	ttsProvider: Io.Auto,
	modelId: Ro,
	hideButtonForUserLanguage: !1,
	showPopupOnSelection: !1,
	popupMode: No.Full,
	popupLayout: Po.Vert,
	simpleModeShowLangs: !1,
	motionPreference: Fo.System
}, Qo = {
	[ko.Default]: Ao.Default,
	[ko.Medium]: Ao.Medium,
	[ko.High]: Ao.High
}, U = new class {
	#e;
	get settings() {
		return P(this.#e);
	}
	set settings(e) {
		k(this.#e, e, !0);
	}
	#t;
	get themeClass() {
		return P(this.#t);
	}
	set themeClass(e) {
		k(this.#t, e);
	}
	#n;
	get contrast() {
		return P(this.#n);
	}
	set contrast(e) {
		k(this.#n, e);
	}
	#r;
	get motionDisabled() {
		return P(this.#r);
	}
	set motionDisabled(e) {
		k(this.#r, e);
	}
	#i;
	#a = new Ho("prefers-color-scheme: dark");
	#o = new Ho("prefers-reduced-motion: reduce");
	#s = {};
	#c;
	constructor(e) {
		this.#e = /* @__PURE__ */ O(ir(e)), this.#c = e, this.#t = /* @__PURE__ */ D(() => this.#l(this.settings.theme)), this.#n = /* @__PURE__ */ D(() => Qo[this.settings.contrastLevel]), this.#r = /* @__PURE__ */ D(() => this.#u(this.settings.motionPreference)), this.#i = Pr(() => {
			jr(() => {
				let e = Rt(this.settings);
				this.#d(e);
			});
		}), l.storage.local.onChanged.addListener(this.#f);
	}
	#l(e) {
		return e === Oo.System ? this.#a.current ? Oo.Dark : Oo.Light : e;
	}
	#u(e) {
		return e === Fo.System ? this.#o.current : e === Fo.Off;
	}
	async #d(e) {
		for (let t of Object.keys(e)) (0, Xo.default)(this.#s[t], e[t]) || (0, Xo.default)(this.#c[t], e[t]) || await l.storage.local.set({ [t]: e[t] });
		this.#c = e;
	}
	#f = (e) => {
		let t = Rt(this.settings);
		for (let [n, { newValue: r }] of Object.entries(e)) {
			let e = n;
			e in Zo && ((0, Xo.default)(t[e], r) || (this.#s[e] = r, Object.assign(this.settings, { [e]: r })));
		}
	};
	destroy() {
		this.#i(), l.storage.local.onChanged.removeListener(this.#f);
	}
}(await l.storage.local.get(Zo)), $o = { customProviders: [] }, es = class {
	#e;
	get settings() {
		return P(this.#e);
	}
	set settings(e) {
		k(this.#e, e, !0);
	}
	#t;
	#n = !1;
	constructor(e) {
		this.#e = /* @__PURE__ */ O(ir(e)), this.#t = Pr(() => {
			jr(() => {
				if (this.#n) return;
				let e = Rt(this.settings);
				this.#r(e);
			});
		}), l.storage.sync.onChanged.addListener(this.#i);
	}
	async #r(e) {
		(0, Xo.default)(await l.storage.sync.get(), e) || (this.#n = !0, await l.storage.sync.set(e), this.#n = !1);
	}
	#i = (e) => {
		this.#n = !0;
		let t = Rt(this.settings);
		for (let [n, { newValue: r }] of Object.entries(e)) {
			let e = n;
			(0, Xo.default)(t[e], r) || Object.assign(this.settings, { [e]: r });
		}
		this.#n = !1;
	};
	destroy() {
		this.#t(), l.storage.sync.onChanged.removeListener(this.#i);
	}
};
async function ts(e) {
	try {
		return await l.storage.sync.get(e);
	} catch {
		return e;
	}
}
var ns = new es(await ts($o)), rs = [
	{
		id: Lo.GoogleTranslate,
		name: "Google Translate",
		protocol: "simple-api",
		isBuiltin: !0,
		requiresSubscription: !1,
		note: "To avoid rate limit errors, add \"https://translate.googleapis.com\" to your VPN/proxy exceptions.",
		models: [{
			id: Ro,
			model: "google-translate",
			maxInputChars: 5e3
		}]
	},
	{
		id: Lo.MyMemory,
		name: "MyMemory",
		protocol: "simple-api",
		isBuiltin: !0,
		requiresSubscription: !1,
		note: "Limit: 500 characters per request, 50,000 characters per day.\n<a href=\"https://mymemory.translated.net/doc/usagelimits.php\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline\">MyMemory: API usage limits</a>",
		models: [{
			id: "mymemory-free",
			model: "mymemory",
			maxInputChars: 500
		}]
	},
	{
		id: Lo.TranslatorApi,
		name: "Translator API",
		protocol: "browser-api",
		isBuiltin: !0,
		requiresSubscription: !1,
		note: "Translator and Language Detector APIs are experimental technology.\nCurrently supported in Chrome 138+ and Opera 122+.\nMay have geographical restrictions.\nWorks offline after model download.",
		models: [{
			id: "translator-api-free",
			model: "translator-api",
			maxInputChars: 5e3
		}]
	}
], is = new class {
	#e = /* @__PURE__ */ D(() => [...rs, ...ns.settings.customProviders]);
	get providers() {
		return P(this.#e);
	}
	set providers(e) {
		k(this.#e, e);
	}
	#t = /* @__PURE__ */ D(() => this.findProviderByModelId(U.settings.modelId, this.providers));
	get selectedProvider() {
		return P(this.#t);
	}
	set selectedProvider(e) {
		k(this.#t, e);
	}
	#n = /* @__PURE__ */ D(() => this.selectedProvider.models.find((e) => e.id === U.settings.modelId) || rs[0].models[0]);
	get selectedModel() {
		return P(this.#n);
	}
	set selectedModel(e) {
		k(this.#n, e);
	}
	#r = /* @__PURE__ */ D(() => U.settings.modelId === Ro);
	get isSelectedProviderGoogle() {
		return P(this.#r);
	}
	set isSelectedProviderGoogle(e) {
		k(this.#r, e);
	}
	#i = /* @__PURE__ */ O(ir(this.selectedProvider.id));
	get activeTabProviderId() {
		return P(this.#i);
	}
	set activeTabProviderId(e) {
		k(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ D(() => this.providers.find((e) => e.id === this.activeTabProviderId) || rs[0]);
	get activeTabProvider() {
		return P(this.#a);
	}
	set activeTabProvider(e) {
		k(this.#a, e);
	}
	#o = /* @__PURE__ */ D(() => ns.settings.customProviders.findIndex((e) => e.id === this.activeTabProviderId));
	get activeCustomProviderIndex() {
		return P(this.#o);
	}
	set activeCustomProviderIndex(e) {
		k(this.#o, e);
	}
	#s = /* @__PURE__ */ D(() => this.isUnfinishedSetup(this.activeTabProvider));
	get activeTabProviderUnfinishedSetup() {
		return P(this.#s);
	}
	set activeTabProviderUnfinishedSetup(e) {
		k(this.#s, e);
	}
	#c = /* @__PURE__ */ D(() => !this.activeTabProvider.isBuiltin);
	get isCustomProvider() {
		return P(this.#c);
	}
	set isCustomProvider(e) {
		k(this.#c, e);
	}
	#l = /* @__PURE__ */ O(!0);
	get isTranslationAPIAvailable() {
		return P(this.#l);
	}
	set isTranslationAPIAvailable(e) {
		k(this.#l, e, !0);
	}
	#u = /* @__PURE__ */ D(() => this.activeTabProviderId === Lo.TranslatorApi && !is.isTranslationAPIAvailable);
	get isTranslationAPIUnavailable() {
		return P(this.#u);
	}
	set isTranslationAPIUnavailable(e) {
		k(this.#u, e);
	}
	findProviderByModelId(e, t) {
		return t.find((t) => t.models.some((t) => t.id === e)) || rs[0];
	}
	isUnfinishedSetup(e) {
		return !e.isBuiltin && (!e.baseUrl || !e.apiKey || !e.models.some((e) => e.model));
	}
	addProvider = () => {
		alert("This feature will be available soon.");
	};
	updateProvider = (e) => {
		this.activeCustomProviderIndex !== -1 && (ns.settings.customProviders[this.activeCustomProviderIndex] = {
			...ns.settings.customProviders[this.activeCustomProviderIndex],
			...e
		});
	};
	deleteProvider = (e) => {
		ns.settings.customProviders = ns.settings.customProviders.filter((t) => t.id !== e), this.selectedProvider.id === e && (U.settings.modelId = Ro), this.activeTabProviderId = Lo.GoogleTranslate;
	};
	addModel = () => {
		if (this.activeCustomProviderIndex === -1) return;
		let e = crypto.randomUUID();
		ns.settings.customProviders[this.activeCustomProviderIndex].models.push({
			id: e,
			model: ""
		});
	};
	updateModel = (e, t) => {
		if (this.activeCustomProviderIndex === -1) return;
		let n = ns.settings.customProviders[this.activeCustomProviderIndex].models.findIndex((t) => t.id === e);
		n !== -1 && (ns.settings.customProviders[this.activeCustomProviderIndex].models[n].model = t);
	};
	selectModel = (e) => {
		U.settings.modelId = e;
	};
	deleteModel = (e) => {
		if (this.activeCustomProviderIndex === -1) return;
		let t = U.settings.modelId === e;
		if (ns.settings.customProviders[this.activeCustomProviderIndex].models = ns.settings.customProviders[this.activeCustomProviderIndex].models.filter((t) => t.id !== e), t) {
			let e = this.activeTabProvider.models.find((e) => e.model && e.model.trim() !== "");
			if (e) U.settings.modelId = e.id;
			else {
				let e = rs[0];
				U.settings.modelId = e.models[0].id, this.activeTabProviderId = e.id;
			}
		}
	};
}(), as = new class {
	port = null;
	isTranslating = !1;
	callbacks = {};
	ensureConnection() {
		return this.port ? this.port : (console.log("Creating new translation port connection"), this.port = l.runtime.connect({ name: "translation-stream" }), this.port.onMessage.addListener(this.handleMessage), this.port.onDisconnect.addListener(() => {
			console.log("Translation port disconnected"), l.runtime.lastError && console.warn("Port disconnect error:", l.runtime.lastError.message), this.port = null, this.isTranslating && (this.isTranslating = !1, this.callbacks.onError?.("Connection lost. Please try again."), this.callbacks = {});
		}), this.port);
	}
	handleMessage = (e) => {
		switch (e.type) {
			case "translation-start":
				this.isTranslating = !0, this.callbacks.onStart?.();
				break;
			case "download-progress":
				this.callbacks.onDownloadProgress?.(e.percent);
				break;
			case "translation-chunk":
				this.callbacks.onChunk?.(e.chunk, e.sourceLang);
				break;
			case "translation-complete":
				this.isTranslating = !1, this.callbacks.onComplete?.(e.finalText, e.sourceLang, e.cacheKey);
				break;
			case "translation-cancel":
				this.isTranslating = !1, this.callbacks.onCancel?.(), console.log("Translation canceled");
				break;
			case "translation-error":
				this.isTranslating = !1, this.callbacks.onError?.(e.error);
				break;
			default:
				console.error(`Unknown message: ${JSON.stringify(e)}`);
				break;
		}
	};
	translateText(e, t, n, r, i, a) {
		this.isTranslating && this.cancelTranslation(), this.callbacks = r, this.ensureConnection().postMessage({
			type: "translate",
			text: e,
			targetLang: t,
			currentModelId: n,
			sourceLang: i,
			ignoreCache: a
		});
	}
	cancelTranslation() {
		this.port && this.port.postMessage({ type: "cancel" });
	}
}(), W = new class {
	#e = /* @__PURE__ */ O(ir({
		google: [],
		ai: []
	}));
	get errors() {
		return P(this.#e);
	}
	set errors(e) {
		k(this.#e, e, !0);
	}
	#t = /* @__PURE__ */ O("");
	get hostname() {
		return P(this.#t);
	}
	set hostname(e) {
		k(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ O();
	get detectedLang() {
		return P(this.#n);
	}
	set detectedLang(e) {
		k(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ O("");
	get selectedText() {
		return P(this.#r);
	}
	set selectedText(e) {
		k(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ O("");
	get textToTranslate() {
		return P(this.#i);
	}
	set textToTranslate(e) {
		k(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ O(!1);
	get showPopup() {
		return P(this.#a);
	}
	set showPopup(e) {
		k(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ O(null);
	get selectedElemRect() {
		return P(this.#o);
	}
	set selectedElemRect(e) {
		k(this.#o, e, !0);
	}
	#s = /* @__PURE__ */ O(null);
	get selectedEndCoord() {
		return P(this.#s);
	}
	set selectedEndCoord(e) {
		k(this.#s, e, !0);
	}
	#c = /* @__PURE__ */ O(!1);
	get isInTextField() {
		return P(this.#c);
	}
	set isInTextField(e) {
		k(this.#c, e, !0);
	}
	#l = /* @__PURE__ */ O(null);
	get translated() {
		return P(this.#l);
	}
	set translated(e) {
		k(this.#l, e, !0);
	}
	#u = /* @__PURE__ */ O(null);
	get translationAi() {
		return P(this.#u);
	}
	set translationAi(e) {
		k(this.#u, e, !0);
	}
	#d = /* @__PURE__ */ O(ir([]));
	get cacheKeys() {
		return P(this.#d);
	}
	set cacheKeys(e) {
		k(this.#d, e, !0);
	}
	#f = /* @__PURE__ */ O(-1);
	get cacheIndex() {
		return P(this.#f);
	}
	set cacheIndex(e) {
		k(this.#f, e, !0);
	}
	#p = /* @__PURE__ */ O(!1);
	get isPending() {
		return P(this.#p);
	}
	set isPending(e) {
		k(this.#p, e, !0);
	}
	#m = /* @__PURE__ */ O(null);
	get audioContextSource() {
		return P(this.#m);
	}
	set audioContextSource(e) {
		k(this.#m, e, !0);
	}
	#h = /* @__PURE__ */ O(ir([]));
	get cacheTTS() {
		return P(this.#h);
	}
	set cacheTTS(e) {
		k(this.#h, e, !0);
	}
	#g = /* @__PURE__ */ O("");
	get textToHighlight() {
		return P(this.#g);
	}
	set textToHighlight(e) {
		k(this.#g, e, !0);
	}
	#_ = /* @__PURE__ */ O(null);
	get downloadProgress() {
		return P(this.#_);
	}
	set downloadProgress(e) {
		k(this.#_, e, !0);
	}
	#v = /* @__PURE__ */ D(() => U.settings.modelId === Ro);
	get isProviderGoogle() {
		return P(this.#v);
	}
	set isProviderGoogle(e) {
		k(this.#v, e);
	}
	#y = /* @__PURE__ */ D(() => !!this.translated?.dict || !!this.translated?.definitions || !!this.translated?.examples);
	get showFooter() {
		return P(this.#y);
	}
	set showFooter(e) {
		k(this.#y, e);
	}
	#b = /* @__PURE__ */ D(() => this.cacheIndex !== -1 && this.translationAi === null);
	get isCachedItem() {
		return P(this.#b);
	}
	set isCachedItem(e) {
		k(this.#b, e);
	}
	async translate(e = !1) {
		let t = this.textToTranslate.trim();
		if (!t) return;
		if (U.settings.sourceLang === U.settings.targetLang) {
			let e = "Source and target languages must be different";
			this.errors.google.push(e), this.errors.ai.push(e);
			return;
		}
		this.translated = null, this.translationAi = null, this.errors = {
			google: [],
			ai: []
		};
		let [n, r] = await Promise.all([this.translateGoogle(t), this.isProviderGoogle ? Promise.resolve(null) : this.translateAi(t, e)]);
		if (this.isProviderGoogle && !n || !this.isProviderGoogle && !r) return;
		let i = !this.isProviderGoogle && r ? r.text : n?.sentence.trans || "";
		this.addToHistory(t, i), this.addKeysToCache(n?.cacheKey, r?.cacheKey);
	}
	stopTranslation = () => {
		as.cancelTranslation();
	};
	resetTranslateStore = () => {
		this.selectedText = "", this.textToTranslate = "", this.detectedLang = void 0, this.translated = null, this.translationAi = null, this.errors = {
			google: [],
			ai: []
		};
	};
	openPopup = () => {
		this.showPopup = !0, this.textToTranslate = this.selectedText, this.translate();
	};
	reTranslate = () => {
		this.textToTranslate && this.translate();
	};
	reTranslateIgnoreCache = () => {
		this.textToTranslate && this.translate(!0);
	};
	reverseTranslation = (e) => {
		if (!this.detectedLang) return;
		let t = qo(this.detectedLang);
		t && (U.settings.sourceLang !== "auto" && (U.settings.sourceLang = U.settings.targetLang), U.settings.targetLang = t, e ? this.textToTranslate = e : this.textToTranslate = this.isProviderGoogle ? this.translated?.sentence.trans || "" : this.translationAi?.text || "", this.translate());
	};
	async setCacheItem(e) {
		this.cacheIndex = e;
		let t = this.cacheKeys.at(this.cacheIndex);
		if (!t) return;
		let n = await this.getCachedItem(t.googleKey), r = await this.getCachedItem(t.aiKey);
		this.translated = n, this.translationAi = r, this.detectedLang = n?.sourceLang, U.settings.targetLang = n?.targetLang ?? U.settings.targetLang;
	}
	async getCachedItem(e) {
		if (!e) return null;
		try {
			return await l.runtime.sendMessage({
				type: "getCachedItem",
				content: { cacheKey: e }
			});
		} catch (e) {
			return console.error("Error get cached item: ", e), null;
		}
	}
	async translateAi(e, t) {
		let n = U.settings.sourceLang === "auto" ? void 0 : U.settings.sourceLang, r = U.settings.targetLang, i = U.settings.modelId;
		return new Promise((a) => {
			as.translateText(e, r, i, {
				onStart: () => {
					this.translationAi = {
						text: "",
						isStreaming: !0
					};
				},
				onDownloadProgress: (e) => {
					this.downloadProgress = Math.round(e * 100);
				},
				onChunk: (e, t) => {
					this.translationAi && (this.downloadProgress = null, this.translationAi.text += e), t && (this.detectedLang ??= t);
				},
				onComplete: (e, t, n) => {
					this.translationAi && (this.downloadProgress = null, this.translationAi.text = e, this.translationAi.isStreaming = !1), t && (this.detectedLang ??= t), a({
						text: e,
						cacheKey: n
					});
				},
				onError: (e) => {
					console.log("Translation error:", e), this.errors.ai.push(e), this.translationAi && (this.downloadProgress = null, this.translationAi.isStreaming = !1), a(null);
				},
				onCancel: () => {
					console.log("Translation canceled"), this.translationAi && (this.downloadProgress = null, this.translationAi.isStreaming = !1), a(null);
				}
			}, n, t);
		});
	}
	async translateGoogle(e) {
		this.isPending = !0;
		let t = U.settings.sourceLang, n = U.settings.targetLang, r = await this.getGoogleTranslate(t, n, e);
		return !r || r.error ? (this.isPending = !1, console.debug(r?.error), this.errors.google.push(r?.error || ""), null) : (this.detectedLang = r.src, this.translated = r, this.isPending = !1, r);
	}
	async getGoogleTranslate(e, t, n) {
		try {
			return await l.runtime.sendMessage({
				type: "getTranslate",
				content: {
					sourceLang: e,
					targetLang: t,
					text: n
				}
			});
		} catch (e) {
			console.error("Error occurred while fetching translation: ", e);
		}
	}
	async addToHistory(e = "", t = "") {
		if (!U.settings.historyEnable || !e || !t) return;
		let n = this.detectedLang || U.settings.sourceLang, r = U.settings.targetLang, i = `${is.selectedProvider.name}/${is.selectedModel.model}`, a = {
			sourceLang: n,
			targetLang: r,
			orig: e,
			trans: t,
			time: Date.now(),
			model: i
		}, { history: o = [] } = await l.storage.local.get(["history"]);
		o.push(a);
		let s = o.length > U.settings.historyLength ? o.slice(-U.settings.historyLength) : o;
		await l.storage.local.set({ history: s });
	}
	addKeysToCache(e, t) {
		let n = this.cacheKeys.at(-1);
		n?.googleKey === e && n?.aiKey === t || (this.cacheKeys.push({
			googleKey: e,
			aiKey: t
		}), this.cacheIndex = -1);
	}
}(), os = (e) => e;
function ss(e) {
	let t = e - 1;
	return t * t * t + 1;
}
function cs(e) {
	let t = typeof e == "string" && e.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return t ? [parseFloat(t[1]), t[2] || "px"] : [e, "px"];
}
function ls(e, { delay: t = 0, duration: n = 400, easing: r = os } = {}) {
	let i = +getComputedStyle(e).opacity;
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e) => `opacity: ${e * i}`
	};
}
function us(e, { delay: t = 0, duration: n = 400, easing: r = ss, x: i = 0, y: a = 0, opacity: o = 0 } = {}) {
	let s = getComputedStyle(e), c = +s.opacity, l = s.transform === "none" ? "" : s.transform, u = c * (1 - o), [d, f] = cs(i), [p, m] = cs(a);
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e, t) => `
			transform: ${l} translate(${(1 - e) * d}${f}, ${(1 - e) * p}${m});
			opacity: ${c - u * t}`
	};
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var ds = Math.min, fs = Math.max, ps = Math.round, ms = (e) => ({
	x: e,
	y: e
}), hs = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function gs(e, t, n) {
	return fs(e, ds(t, n));
}
function _s(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function vs(e) {
	return e.split("-")[0];
}
function ys(e) {
	return e.split("-")[1];
}
function bs(e) {
	return e === "x" ? "y" : "x";
}
function xs(e) {
	return e === "y" ? "height" : "width";
}
function Ss(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function Cs(e) {
	return bs(Ss(e));
}
function ws(e, t, n) {
	n === void 0 && (n = !1);
	let r = ys(e), i = Cs(e), a = xs(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = Ns(o)), [o, Ns(o)];
}
function Ts(e) {
	let t = Ns(e);
	return [
		Es(e),
		t,
		Es(t)
	];
}
function Es(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var Ds = ["left", "right"], Os = ["right", "left"], ks = ["top", "bottom"], As = ["bottom", "top"];
function js(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? Os : Ds : t ? Ds : Os;
		case "left":
		case "right": return t ? ks : As;
		default: return [];
	}
}
function Ms(e, t, n, r) {
	let i = ys(e), a = js(vs(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(Es)))), a;
}
function Ns(e) {
	let t = vs(e);
	return hs[t] + e.slice(t.length);
}
function Ps(e) {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...e
	};
}
function Fs(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : Ps(e);
}
function Is(e) {
	let { x: t, y: n, width: r, height: i } = e;
	return {
		width: r,
		height: i,
		top: n,
		left: t,
		right: t + r,
		bottom: n + i,
		x: t,
		y: n
	};
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+core@1.7.5/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function Ls(e, t, n) {
	let { reference: r, floating: i } = e, a = Ss(t), o = Cs(t), s = xs(o), c = vs(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
	switch (c) {
		case "top":
			p = {
				x: u,
				y: r.y - i.height
			};
			break;
		case "bottom":
			p = {
				x: u,
				y: r.y + r.height
			};
			break;
		case "right":
			p = {
				x: r.x + r.width,
				y: d
			};
			break;
		case "left":
			p = {
				x: r.x - i.width,
				y: d
			};
			break;
		default: p = {
			x: r.x,
			y: r.y
		};
	}
	switch (ys(t)) {
		case "start":
			p[o] -= f * (n && l ? -1 : 1);
			break;
		case "end":
			p[o] += f * (n && l ? -1 : 1);
			break;
	}
	return p;
}
async function Rs(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = _s(t, e), p = Fs(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = Is(await i.getClippingRect({
		element: await (i.isElement == null ? void 0 : i.isElement(m)) ?? !0 ? m : m.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating)),
		boundary: c,
		rootBoundary: l,
		strategy: s
	})), g = u === "floating" ? {
		x: n,
		y: r,
		width: a.floating.width,
		height: a.floating.height
	} : a.reference, _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)), v = await (i.isElement == null ? void 0 : i.isElement(_)) && await (i.getScale == null ? void 0 : i.getScale(_)) || {
		x: 1,
		y: 1
	}, y = Is(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements: o,
		rect: g,
		offsetParent: _,
		strategy: s
	}) : g);
	return {
		top: (h.top - y.top + p.top) / v.y,
		bottom: (y.bottom - h.bottom + p.bottom) / v.y,
		left: (h.left - y.left + p.left) / v.x,
		right: (y.right - h.right + p.right) / v.x
	};
}
var zs = 50, Bs = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: Rs
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = Ls(l, r, c), f = r, p = 0, m = {};
	for (let n = 0; n < a.length; n++) {
		let h = a[n];
		if (!h) continue;
		let { name: g, fn: _ } = h, { x: v, y, data: b, reset: x } = await _({
			x: u,
			y: d,
			initialPlacement: r,
			placement: f,
			strategy: i,
			middlewareData: m,
			rects: l,
			platform: s,
			elements: {
				reference: e,
				floating: t
			}
		});
		u = v ?? u, d = y ?? d, m[g] = {
			...m[g],
			...b
		}, x && p < zs && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = Ls(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, Vs = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = _s(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = vs(r), _ = Ss(o), v = vs(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [Ns(o)] : Ts(o)), x = p !== "none";
			!d && x && b.push(...Ms(o, m, p, y));
			let ee = [o, ...b], S = await s.detectOverflow(t, h), C = [], te = i.flip?.overflows || [];
			if (l && C.push(S[g]), u) {
				let e = ws(r, a, y);
				C.push(S[e[0]], S[e[1]]);
			}
			if (te = [...te, {
				placement: r,
				overflows: C
			}], !C.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = ee[e];
				if (t && (!(u === "alignment" && _ !== Ss(t)) || te.every((e) => Ss(e.placement) === _ ? e.overflows[0] > 0 : !0))) return {
					data: {
						index: e,
						overflows: te
					},
					reset: { placement: t }
				};
				let n = te.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
				if (!n) switch (f) {
					case "bestFit": {
						let e = te.filter((e) => {
							if (x) {
								let t = Ss(e.placement);
								return t === _ || t === "y";
							}
							return !0;
						}).map((e) => [e.placement, e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]?.[0];
						e && (n = e);
						break;
					}
					case "initialPlacement":
						n = o;
						break;
				}
				if (r !== n) return { reset: { placement: n } };
			}
			return {};
		}
	};
}, Hs = /* @__PURE__ */ new Set(["left", "top"]);
async function Us(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = vs(n), s = ys(n), c = Ss(n) === "y", l = Hs.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = _s(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
		mainAxis: d,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: d.mainAxis || 0,
		crossAxis: d.crossAxis || 0,
		alignmentAxis: d.alignmentAxis
	};
	return s && typeof m == "number" && (p = s === "end" ? m * -1 : m), c ? {
		x: p * u,
		y: f * l
	} : {
		x: f * l,
		y: p * u
	};
}
var Ws = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await Us(t, e);
			return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset ? {} : {
				x: r + s.x,
				y: i + s.y,
				data: {
					...s,
					placement: a
				}
			};
		}
	};
}, Gs = function(e) {
	return e === void 0 && (e = {}), {
		name: "shift",
		options: e,
		async fn(t) {
			let { x: n, y: r, placement: i, platform: a } = t, { mainAxis: o = !0, crossAxis: s = !1, limiter: c = { fn: (e) => {
				let { x: t, y: n } = e;
				return {
					x: t,
					y: n
				};
			} }, ...l } = _s(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = Ss(vs(i)), p = bs(f), m = u[p], h = u[f];
			if (o) {
				let e = p === "y" ? "top" : "left", t = p === "y" ? "bottom" : "right", n = m + d[e], r = m - d[t];
				m = gs(n, m, r);
			}
			if (s) {
				let e = f === "y" ? "top" : "left", t = f === "y" ? "bottom" : "right", n = h + d[e], r = h - d[t];
				h = gs(n, h, r);
			}
			let g = c.fn({
				...t,
				[p]: m,
				[f]: h
			});
			return {
				...g,
				data: {
					x: g.x - n,
					y: g.y - r,
					enabled: {
						[p]: o,
						[f]: s
					}
				}
			};
		}
	};
};
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function Ks() {
	return typeof window < "u";
}
function qs(e) {
	return Xs(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Js(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Ys(e) {
	return ((Xs(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function Xs(e) {
	return Ks() ? e instanceof Node || e instanceof Js(e).Node : !1;
}
function Zs(e) {
	return Ks() ? e instanceof Element || e instanceof Js(e).Element : !1;
}
function Qs(e) {
	return Ks() ? e instanceof HTMLElement || e instanceof Js(e).HTMLElement : !1;
}
function $s(e) {
	return !Ks() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Js(e).ShadowRoot;
}
function ec(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = dc(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function tc(e) {
	return /^(table|td|th)$/.test(qs(e));
}
function nc(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var rc = /transform|translate|scale|rotate|perspective|filter/, ic = /paint|layout|strict|content/, ac = (e) => !!e && e !== "none", oc;
function sc(e) {
	let t = Zs(e) ? dc(e) : e;
	return ac(t.transform) || ac(t.translate) || ac(t.scale) || ac(t.rotate) || ac(t.perspective) || !lc() && (ac(t.backdropFilter) || ac(t.filter)) || rc.test(t.willChange || "") || ic.test(t.contain || "");
}
function cc(e) {
	let t = pc(e);
	for (; Qs(t) && !uc(t);) {
		if (sc(t)) return t;
		if (nc(t)) return null;
		t = pc(t);
	}
	return null;
}
function lc() {
	return oc ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), oc;
}
function uc(e) {
	return /^(html|body|#document)$/.test(qs(e));
}
function dc(e) {
	return Js(e).getComputedStyle(e);
}
function fc(e) {
	return Zs(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function pc(e) {
	if (qs(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || $s(e) && e.host || Ys(e);
	return $s(t) ? t.host : t;
}
function mc(e) {
	let t = pc(e);
	return uc(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Qs(t) && ec(t) ? t : mc(t);
}
function hc(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = mc(e), i = r === e.ownerDocument?.body, a = Js(r);
	if (i) {
		let e = gc(a);
		return t.concat(a, a.visualViewport || [], ec(r) ? r : [], e && n ? hc(e) : []);
	} else return t.concat(r, hc(r, [], n));
}
function gc(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+dom@1.7.6/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function _c(e) {
	let t = dc(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = Qs(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = ps(n) !== a || ps(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function vc(e) {
	return Zs(e) ? e : e.contextElement;
}
function yc(e) {
	let t = vc(e);
	if (!Qs(t)) return ms(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = _c(t), o = (a ? ps(n.width) : n.width) / r, s = (a ? ps(n.height) : n.height) / i;
	return (!o || !Number.isFinite(o)) && (o = 1), (!s || !Number.isFinite(s)) && (s = 1), {
		x: o,
		y: s
	};
}
var bc = /* @__PURE__ */ ms(0);
function xc(e) {
	let t = Js(e);
	return !lc() || !t.visualViewport ? bc : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function Sc(e, t, n) {
	return t === void 0 && (t = !1), !n || t && n !== Js(e) ? !1 : t;
}
function Cc(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = vc(e), o = ms(1);
	t && (r ? Zs(r) && (o = yc(r)) : o = yc(e));
	let s = Sc(a, n, r) ? xc(a) : ms(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a) {
		let e = Js(a), t = r && Zs(r) ? Js(r) : r, n = e, i = gc(n);
		for (; i && r && t !== n;) {
			let e = yc(i), t = i.getBoundingClientRect(), r = dc(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = Js(i), i = gc(n);
		}
	}
	return Is({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function wc(e, t) {
	let n = fc(e).scrollLeft;
	return t ? t.left + n : Cc(Ys(e)).left + n;
}
function Tc(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - wc(e, n),
		y: n.top + t.scrollTop
	};
}
function Ec(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = Ys(r), s = t ? nc(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = ms(1), u = ms(0), d = Qs(r);
	if ((d || !d && !a) && ((qs(r) !== "body" || ec(o)) && (c = fc(r)), d)) {
		let e = Cc(r);
		l = yc(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? Tc(o, c) : ms(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Dc(e) {
	return Array.from(e.getClientRects());
}
function Oc(e) {
	let t = Ys(e), n = fc(e), r = e.ownerDocument.body, i = fs(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), a = fs(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight), o = -n.scrollLeft + wc(e), s = -n.scrollTop;
	return dc(r).direction === "rtl" && (o += fs(t.clientWidth, r.clientWidth) - i), {
		width: i,
		height: a,
		x: o,
		y: s
	};
}
var kc = 25;
function Ac(e, t) {
	let n = Js(e), r = Ys(e), i = n.visualViewport, a = r.clientWidth, o = r.clientHeight, s = 0, c = 0;
	if (i) {
		a = i.width, o = i.height;
		let e = lc();
		(!e || e && t === "fixed") && (s = i.offsetLeft, c = i.offsetTop);
	}
	let l = wc(r);
	if (l <= 0) {
		let e = r.ownerDocument, t = e.body, n = getComputedStyle(t), i = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, o = Math.abs(r.clientWidth - t.clientWidth - i);
		o <= kc && (a -= o);
	} else l <= kc && (a += l);
	return {
		width: a,
		height: o,
		x: s,
		y: c
	};
}
function jc(e, t) {
	let n = Cc(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = Qs(e) ? yc(e) : ms(1);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function Mc(e, t, n) {
	let r;
	if (t === "viewport") r = Ac(e, n);
	else if (t === "document") r = Oc(Ys(e));
	else if (Zs(t)) r = jc(t, n);
	else {
		let n = xc(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return Is(r);
}
function Nc(e, t) {
	let n = pc(e);
	return n === t || !Zs(n) || uc(n) ? !1 : dc(n).position === "fixed" || Nc(n, t);
}
function Pc(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = hc(e, [], !1).filter((e) => Zs(e) && qs(e) !== "body"), i = null, a = dc(e).position === "fixed", o = a ? pc(e) : e;
	for (; Zs(o) && !uc(o);) {
		let t = dc(o), n = sc(o);
		!n && t.position === "fixed" && (i = null), (a ? !n && !i : !n && t.position === "static" && i && (i.position === "absolute" || i.position === "fixed") || ec(o) && !n && Nc(e, o)) ? r = r.filter((e) => e !== o) : i = t, o = pc(o);
	}
	return t.set(e, r), r;
}
function Fc(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? nc(t) ? [] : Pc(t, this._c) : [].concat(n), r], o = Mc(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = Mc(t, a[e], i);
		s = fs(n.top, s), c = ds(n.right, c), l = ds(n.bottom, l), u = fs(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Ic(e) {
	let { width: t, height: n } = _c(e);
	return {
		width: t,
		height: n
	};
}
function Lc(e, t, n) {
	let r = Qs(t), i = Ys(t), a = n === "fixed", o = Cc(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = ms(0);
	function l() {
		c.x = wc(i);
	}
	if (r || !r && !a) if ((qs(t) !== "body" || ec(i)) && (s = fc(t)), r) {
		let e = Cc(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	} else i && l();
	a && !r && i && l();
	let u = i && !r && !a ? Tc(i, s) : ms(0);
	return {
		x: o.left + s.scrollLeft - c.x - u.x,
		y: o.top + s.scrollTop - c.y - u.y,
		width: o.width,
		height: o.height
	};
}
function Rc(e) {
	return dc(e).position === "static";
}
function zc(e, t) {
	if (!Qs(e) || dc(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return Ys(e) === n && (n = n.ownerDocument.body), n;
}
function Bc(e, t) {
	let n = Js(e);
	if (nc(e)) return n;
	if (!Qs(e)) {
		let t = pc(e);
		for (; t && !uc(t);) {
			if (Zs(t) && !Rc(t)) return t;
			t = pc(t);
		}
		return n;
	}
	let r = zc(e, t);
	for (; r && tc(r) && Rc(r);) r = zc(r, t);
	return r && uc(r) && Rc(r) && !sc(r) ? n : r || cc(e) || n;
}
var Vc = async function(e) {
	let t = this.getOffsetParent || Bc, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: Lc(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Hc(e) {
	return dc(e).direction === "rtl";
}
var Uc = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Ec,
	getDocumentElement: Ys,
	getClippingRect: Fc,
	getOffsetParent: Bc,
	getElementRects: Vc,
	getClientRects: Dc,
	getDimensions: Ic,
	getScale: yc,
	isElement: Zs,
	isRTL: Hc
}, Wc = Ws, Gc = Gs, Kc = Vs, qc = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = {
		platform: Uc,
		...n
	}, a = {
		...i.platform,
		_c: r
	};
	return Bs(e, t, {
		...i,
		platform: a
	});
}, Jc = /\s+/g, Yc = (e) => typeof e != "string" || !e ? e : e.replace(Jc, " ").trim(), Xc = (...e) => {
	let t = [], n = (e) => {
		if (!e && e !== 0 && e !== 0n) return;
		if (Array.isArray(e)) {
			for (let t = 0, r = e.length; t < r; t++) n(e[t]);
			return;
		}
		let r = typeof e;
		if (r === "string" || r === "number" || r === "bigint") {
			if (r === "number" && e !== e) return;
			t.push(String(e));
		} else if (r === "object") {
			let n = Object.keys(e);
			for (let r = 0, i = n.length; r < i; r++) {
				let i = n[r];
				e[i] && t.push(i);
			}
		}
	};
	for (let t = 0, r = e.length; t < r; t++) {
		let r = e[t];
		r != null && n(r);
	}
	return t.length > 0 ? Yc(t.join(" ")) : void 0;
}, Zc = (e) => e === !1 ? "false" : e === !0 ? "true" : e === 0 ? "0" : e, Qc = (e) => {
	if (!e || typeof e != "object") return !0;
	for (let t in e) return !1;
	return !0;
}, $c = (e, t) => {
	if (e === t) return !0;
	if (!e || !t) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	if (n.length !== r.length) return !1;
	for (let i = 0; i < n.length; i++) {
		let a = n[i];
		if (!r.includes(a) || e[a] !== t[a]) return !1;
	}
	return !0;
}, el = (e, t) => {
	for (let n in t) if (Object.prototype.hasOwnProperty.call(t, n)) {
		let r = t[n];
		n in e ? e[n] = Xc(e[n], r) : e[n] = r;
	}
	return e;
}, tl = (e, t) => {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		Array.isArray(r) ? tl(r, t) : r && t.push(r);
	}
}, nl = (...e) => {
	let t = [];
	tl(e, t);
	let n = [];
	for (let e = 0; e < t.length; e++) t[e] && n.push(t[e]);
	return n;
}, rl = (e, t) => {
	let n = {};
	for (let r in e) {
		let i = e[r];
		if (r in t) {
			let e = t[r];
			Array.isArray(i) || Array.isArray(e) ? n[r] = nl(e, i) : typeof i == "object" && typeof e == "object" && i && e ? n[r] = rl(i, e) : n[r] = e + " " + i;
		} else n[r] = i;
	}
	for (let r in t) r in e || (n[r] = t[r]);
	return n;
}, il = {
	twMerge: !0,
	twMergeConfig: {}
};
function al() {
	let e = null, t = {}, n = !1;
	return {
		get cachedTwMerge() {
			return e;
		},
		set cachedTwMerge(t) {
			e = t;
		},
		get cachedTwMergeConfig() {
			return t;
		},
		set cachedTwMergeConfig(e) {
			t = e;
		},
		get didTwMergeConfigChange() {
			return n;
		},
		set didTwMergeConfigChange(e) {
			n = e;
		},
		reset() {
			e = null, t = {}, n = !1;
		}
	};
}
var ol = al(), sl = (e) => {
	let t = (t, n) => {
		let { extend: r = null, slots: i = {}, variants: a = {}, compoundVariants: o = [], compoundSlots: s = [], defaultVariants: c = {} } = t, l = {
			...il,
			...n
		}, u = r?.base ? Xc(r.base, t?.base) : t?.base, d = r?.variants && !Qc(r.variants) ? rl(a, r.variants) : a, f = r?.defaultVariants && !Qc(r.defaultVariants) ? {
			...r.defaultVariants,
			...c
		} : c;
		!Qc(l.twMergeConfig) && !$c(l.twMergeConfig, ol.cachedTwMergeConfig) && (ol.didTwMergeConfigChange = !0, ol.cachedTwMergeConfig = l.twMergeConfig);
		let p = Qc(r?.slots), m = Qc(i) ? {} : {
			base: Xc(t?.base, p && r?.base),
			...i
		}, h = p ? m : el({ ...r?.slots }, Qc(m) ? { base: t?.base } : m), g = Qc(r?.compoundVariants) ? o : nl(r?.compoundVariants, o), _ = (t) => {
			if (Qc(d) && Qc(i) && p) return e(u, t?.class, t?.className)(l);
			if (g && !Array.isArray(g)) throw TypeError(`The "compoundVariants" prop must be an array. Received: ${typeof g}`);
			if (s && !Array.isArray(s)) throw TypeError(`The "compoundSlots" prop must be an array. Received: ${typeof s}`);
			let n = (e, n = d, r = null, i = null) => {
				let a = n[e];
				if (!a || Qc(a)) return null;
				let o = i?.[e] ?? t?.[e];
				if (o === null) return null;
				let s = Zc(o);
				if (typeof s == "object") return null;
				let c = f?.[e];
				return a[(s ?? Zc(c)) || "false"];
			}, r = () => {
				if (!d) return null;
				let e = Object.keys(d), t = [];
				for (let r = 0; r < e.length; r++) {
					let i = n(e[r], d);
					i && t.push(i);
				}
				return t;
			}, a = (e, t) => {
				if (!d || typeof d != "object") return null;
				let r = [];
				for (let i in d) {
					let a = n(i, d, e, t), o = e === "base" && typeof a == "string" ? a : a && a[e];
					o && r.push(o);
				}
				return r;
			}, o = {};
			for (let e in t) {
				let n = t[e];
				n !== void 0 && (o[e] = n);
			}
			let c = (e, n) => {
				let r = typeof t?.[e] == "object" ? { [e]: t[e]?.initial } : {};
				return {
					...f,
					...o,
					...r,
					...n
				};
			}, m = (e = [], t) => {
				let n = [], r = e.length;
				for (let i = 0; i < r; i++) {
					let { class: r, className: a, ...o } = e[i], s = !0, l = c(null, t);
					for (let e in o) {
						let t = o[e], n = l[e];
						if (Array.isArray(t)) {
							if (!t.includes(n)) {
								s = !1;
								break;
							}
						} else {
							if ((t == null || t === !1) && (n == null || n === !1)) continue;
							if (n !== t) {
								s = !1;
								break;
							}
						}
					}
					s && (r && n.push(r), a && n.push(a));
				}
				return n;
			}, _ = (t) => {
				let n = m(g, t);
				if (!Array.isArray(n)) return n;
				let r = {}, i = e;
				for (let e = 0; e < n.length; e++) {
					let t = n[e];
					if (typeof t == "string") r.base = i(r.base, t)(l);
					else if (typeof t == "object") for (let e in t) r[e] = i(r[e], t[e])(l);
				}
				return r;
			}, v = (e) => {
				if (s.length < 1) return null;
				let t = {}, n = c(null, e);
				for (let e = 0; e < s.length; e++) {
					let { slots: r = [], class: i, className: a, ...o } = s[e];
					if (!Qc(o)) {
						let e = !0;
						for (let t in o) {
							let r = n[t], i = o[t];
							if (r === void 0 || (Array.isArray(i) ? !i.includes(r) : i !== r)) {
								e = !1;
								break;
							}
						}
						if (!e) continue;
					}
					for (let e = 0; e < r.length; e++) {
						let n = r[e];
						t[n] || (t[n] = []), t[n].push([i, a]);
					}
				}
				return t;
			};
			if (!Qc(i) || !p) {
				let t = {};
				if (typeof h == "object" && !Qc(h)) {
					let n = e;
					for (let e in h) t[e] = (t) => {
						let r = _(t), i = v(t);
						return n(h[e], a(e, t), r ? r[e] : void 0, i ? i[e] : void 0, t?.class, t?.className)(l);
					};
				}
				return t;
			}
			return e(u, r(), m(g), t?.class, t?.className)(l);
		};
		return _.variantKeys = (() => {
			if (!(!d || typeof d != "object")) return Object.keys(d);
		})(), _.extend = r, _.base = u, _.slots = h, _.variants = d, _.defaultVariants = f, _.compoundSlots = s, _.compoundVariants = g, _;
	};
	return {
		tv: t,
		createTV: (e) => (n, r) => t(n, r ? rl(e, r) : e)
	};
}, cl = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, ll = (e, t) => ({
	classGroupId: e,
	validator: t
}), ul = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), dl = "-", fl = [], pl = "arbitrary..", ml = (e) => {
	let t = _l(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return gl(e);
			let n = e.split(dl);
			return hl(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? cl(i, t) : t : i || fl;
			}
			return n[e] || fl;
		}
	};
}, hl = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = hl(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(dl) : e.slice(t).join(dl), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, gl = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? pl + r : void 0;
})(), _l = (e) => {
	let { theme: t, classGroups: n } = e;
	return vl(n, t);
}, vl = (e, t) => {
	let n = ul();
	for (let r in e) {
		let i = e[r];
		yl(i, n, r, t);
	}
	return n;
}, yl = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		bl(i, t, n, r);
	}
}, bl = (e, t, n, r) => {
	if (typeof e == "string") {
		xl(e, t, n);
		return;
	}
	if (typeof e == "function") {
		Sl(e, t, n, r);
		return;
	}
	Cl(e, t, n, r);
}, xl = (e, t, n) => {
	let r = e === "" ? t : wl(t, e);
	r.classGroupId = n;
}, Sl = (e, t, n, r) => {
	if (Tl(e)) {
		yl(e(r), t, n, r);
		return;
	}
	t.validators === null && (t.validators = []), t.validators.push(ll(n, e));
}, Cl = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		yl(o, wl(t, a), n, r);
	}
}, wl = (e, t) => {
	let n = e, r = t.split(dl), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = ul(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, Tl = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, El = (e) => {
	if (e < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let t = 0, n = Object.create(null), r = Object.create(null), i = (i, a) => {
		n[i] = a, t++, t > e && (t = 0, r = n, n = Object.create(null));
	};
	return {
		get(e) {
			let t = n[e];
			if (t !== void 0) return t;
			if ((t = r[e]) !== void 0) return i(e, t), t;
		},
		set(e, t) {
			e in n ? n[e] = t : i(e, t);
		}
	};
}, Dl = "!", Ol = ":", kl = [], Al = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), jl = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === Ol) {
					t.push(e.slice(i, s)), i = s + 1;
					continue;
				}
				if (o === "/") {
					a = s;
					continue;
				}
			}
			o === "[" ? n++ : o === "]" ? n-- : o === "(" ? r++ : o === ")" && r--;
		}
		let s = t.length === 0 ? e : e.slice(i), c = s, l = !1;
		s.endsWith(Dl) ? (c = s.slice(0, -1), l = !0) : s.startsWith(Dl) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return Al(t, l, c, u);
	};
	if (t) {
		let e = t + Ol, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : Al(kl, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, Ml = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.orderSensitiveModifiers.forEach((e, n) => {
		t.set(e, 1e6 + n);
	}), (e) => {
		let n = [], r = [];
		for (let i = 0; i < e.length; i++) {
			let a = e[i], o = a[0] === "[", s = t.has(a);
			o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a);
		}
		return r.length > 0 && (r.sort(), n.push(...r)), n;
	};
}, Nl = (e) => ({
	cache: El(e.cacheSize),
	parseClassName: jl(e),
	sortModifiers: Ml(e),
	postfixLookupClassGroupIds: Pl(e),
	...ml(e)
}), Pl = (e) => {
	let t = Object.create(null), n = e.postfixLookupClassGroups;
	if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
	return t;
}, Fl = /\s+/, Il = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t, s = [], c = e.trim().split(Fl), l = "";
	for (let e = c.length - 1; e >= 0; --e) {
		let t = c[e], { isExternal: u, modifiers: d, hasImportantModifier: f, baseClassName: p, maybePostfixModifierPosition: m } = n(t);
		if (u) {
			l = t + (l.length > 0 ? " " + l : l);
			continue;
		}
		let h = !!m, g;
		if (h) {
			g = r(p.substring(0, m));
			let e = g && o[g] ? r(p) : void 0;
			e && e !== g && (g = e, h = !1);
		} else g = r(p);
		if (!g) {
			if (!h) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			if (g = r(p), !g) {
				l = t + (l.length > 0 ? " " + l : l);
				continue;
			}
			h = !1;
		}
		let _ = d.length === 0 ? "" : d.length === 1 ? d[0] : a(d).join(":"), v = f ? _ + Dl : _, y = v + g;
		if (s.indexOf(y) > -1) continue;
		s.push(y);
		let b = i(g, h);
		for (let e = 0; e < b.length; ++e) {
			let t = b[e];
			s.push(v + t);
		}
		l = t + (l.length > 0 ? " " + l : l);
	}
	return l;
}, Ll = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = Rl(n)) && (i && (i += " "), i += r);
	return i;
}, Rl = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = Rl(e[r])) && (n && (n += " "), n += t);
	return n;
}, zl = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = Nl(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = Il(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(Ll(...e));
}, Bl = [], Vl = (e) => {
	let t = (t) => t[e] || Bl;
	return t.isThemeGetter = !0, t;
}, Hl = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Ul = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Wl = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Gl = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Kl = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ql = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Jl = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Yl = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Xl = (e) => Wl.test(e), Zl = (e) => !!e && !Number.isNaN(Number(e)), Ql = (e) => !!e && Number.isInteger(Number(e)), $l = (e) => e.endsWith("%") && Zl(e.slice(0, -1)), eu = (e) => Gl.test(e), tu = () => !0, nu = (e) => Kl.test(e) && !ql.test(e), ru = () => !1, iu = (e) => Jl.test(e), au = (e) => Yl.test(e), ou = (e) => !G(e) && !K(e), su = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), cu = (e) => Cu(e, Du, ru), G = (e) => Hl.test(e), lu = (e) => Cu(e, Ou, nu), uu = (e) => Cu(e, ku, Zl), du = (e) => Cu(e, ju, tu), fu = (e) => Cu(e, Au, ru), pu = (e) => Cu(e, Tu, ru), mu = (e) => Cu(e, Eu, au), hu = (e) => Cu(e, Mu, iu), K = (e) => Ul.test(e), gu = (e) => wu(e, Ou), _u = (e) => wu(e, Au), vu = (e) => wu(e, Tu), yu = (e) => wu(e, Du), bu = (e) => wu(e, Eu), xu = (e) => wu(e, Mu, !0), Su = (e) => wu(e, ju, !0), Cu = (e, t, n) => {
	let r = Hl.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, wu = (e, t, n = !1) => {
	let r = Ul.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, Tu = (e) => e === "position" || e === "percentage", Eu = (e) => e === "image" || e === "url", Du = (e) => e === "length" || e === "size" || e === "bg-size", Ou = (e) => e === "length", ku = (e) => e === "number", Au = (e) => e === "family-name", ju = (e) => e === "number" || e === "weight", Mu = (e) => e === "shadow", Nu = () => {
	let e = Vl("color"), t = Vl("font"), n = Vl("text"), r = Vl("font-weight"), i = Vl("tracking"), a = Vl("leading"), o = Vl("breakpoint"), s = Vl("container"), c = Vl("spacing"), l = Vl("radius"), u = Vl("shadow"), d = Vl("inset-shadow"), f = Vl("text-shadow"), p = Vl("drop-shadow"), m = Vl("blur"), h = Vl("perspective"), g = Vl("aspect"), _ = Vl("ease"), v = Vl("animate"), y = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], b = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	], x = () => [
		...b(),
		K,
		G
	], ee = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], S = () => [
		"auto",
		"contain",
		"none"
	], C = () => [
		K,
		G,
		c
	], te = () => [
		Xl,
		"full",
		"auto",
		...C()
	], ne = () => [
		Ql,
		"none",
		"subgrid",
		K,
		G
	], re = () => [
		"auto",
		{ span: [
			"full",
			Ql,
			K,
			G
		] },
		Ql,
		K,
		G
	], ie = () => [
		Ql,
		"auto",
		K,
		G
	], ae = () => [
		"auto",
		"min",
		"max",
		"fr",
		K,
		G
	], oe = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	], se = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], ce = () => ["auto", ...C()], le = () => [
		Xl,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...C()
	], ue = () => [
		Xl,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...C()
	], de = () => [
		Xl,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...C()
	], w = () => [
		e,
		K,
		G
	], fe = () => [
		...b(),
		vu,
		pu,
		{ position: [K, G] }
	], pe = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], me = () => [
		"auto",
		"cover",
		"contain",
		yu,
		cu,
		{ size: [K, G] }
	], he = () => [
		$l,
		gu,
		lu
	], ge = () => [
		"",
		"none",
		"full",
		l,
		K,
		G
	], _e = () => [
		"",
		Zl,
		gu,
		lu
	], ve = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], ye = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	], be = () => [
		Zl,
		$l,
		vu,
		pu
	], xe = () => [
		"",
		"none",
		m,
		K,
		G
	], Se = () => [
		"none",
		Zl,
		K,
		G
	], Ce = () => [
		"none",
		Zl,
		K,
		G
	], we = () => [
		Zl,
		K,
		G
	], Te = () => [
		Xl,
		"full",
		...C()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [eu],
			breakpoint: [eu],
			color: [tu],
			container: [eu],
			"drop-shadow": [eu],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [ou],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [eu],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [eu],
			shadow: [eu],
			spacing: ["px", Zl],
			text: [eu],
			"text-shadow": [eu],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				Xl,
				G,
				K,
				g
			] }],
			container: ["container"],
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				K,
				G
			] }],
			"container-named": [su],
			columns: [{ columns: [
				Zl,
				G,
				K,
				s
			] }],
			"break-after": [{ "break-after": y() }],
			"break-before": [{ "break-before": y() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			sr: ["sr-only", "not-sr-only"],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: x() }],
			overflow: [{ overflow: ee() }],
			"overflow-x": [{ "overflow-x": ee() }],
			"overflow-y": [{ "overflow-y": ee() }],
			overscroll: [{ overscroll: S() }],
			"overscroll-x": [{ "overscroll-x": S() }],
			"overscroll-y": [{ "overscroll-y": S() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: te() }],
			"inset-x": [{ "inset-x": te() }],
			"inset-y": [{ "inset-y": te() }],
			start: [{
				"inset-s": te(),
				start: te()
			}],
			end: [{
				"inset-e": te(),
				end: te()
			}],
			"inset-bs": [{ "inset-bs": te() }],
			"inset-be": [{ "inset-be": te() }],
			top: [{ top: te() }],
			right: [{ right: te() }],
			bottom: [{ bottom: te() }],
			left: [{ left: te() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				Ql,
				"auto",
				K,
				G
			] }],
			basis: [{ basis: [
				Xl,
				"full",
				"auto",
				s,
				...C()
			] }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			flex: [{ flex: [
				Zl,
				Xl,
				"auto",
				"initial",
				"none",
				G
			] }],
			grow: [{ grow: [
				"",
				Zl,
				K,
				G
			] }],
			shrink: [{ shrink: [
				"",
				Zl,
				K,
				G
			] }],
			order: [{ order: [
				Ql,
				"first",
				"last",
				"none",
				K,
				G
			] }],
			"grid-cols": [{ "grid-cols": ne() }],
			"col-start-end": [{ col: re() }],
			"col-start": [{ "col-start": ie() }],
			"col-end": [{ "col-end": ie() }],
			"grid-rows": [{ "grid-rows": ne() }],
			"row-start-end": [{ row: re() }],
			"row-start": [{ "row-start": ie() }],
			"row-end": [{ "row-end": ie() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": ae() }],
			"auto-rows": [{ "auto-rows": ae() }],
			gap: [{ gap: C() }],
			"gap-x": [{ "gap-x": C() }],
			"gap-y": [{ "gap-y": C() }],
			"justify-content": [{ justify: [...oe(), "normal"] }],
			"justify-items": [{ "justify-items": [...se(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...se()] }],
			"align-content": [{ content: ["normal", ...oe()] }],
			"align-items": [{ items: [...se(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...se(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": oe() }],
			"place-items": [{ "place-items": [...se(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...se()] }],
			p: [{ p: C() }],
			px: [{ px: C() }],
			py: [{ py: C() }],
			ps: [{ ps: C() }],
			pe: [{ pe: C() }],
			pbs: [{ pbs: C() }],
			pbe: [{ pbe: C() }],
			pt: [{ pt: C() }],
			pr: [{ pr: C() }],
			pb: [{ pb: C() }],
			pl: [{ pl: C() }],
			m: [{ m: ce() }],
			mx: [{ mx: ce() }],
			my: [{ my: ce() }],
			ms: [{ ms: ce() }],
			me: [{ me: ce() }],
			mbs: [{ mbs: ce() }],
			mbe: [{ mbe: ce() }],
			mt: [{ mt: ce() }],
			mr: [{ mr: ce() }],
			mb: [{ mb: ce() }],
			ml: [{ ml: ce() }],
			"space-x": [{ "space-x": C() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": C() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: le() }],
			"inline-size": [{ inline: ["auto", ...ue()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...ue()] }],
			"max-inline-size": [{ "max-inline": ["none", ...ue()] }],
			"block-size": [{ block: ["auto", ...de()] }],
			"min-block-size": [{ "min-block": ["auto", ...de()] }],
			"max-block-size": [{ "max-block": ["none", ...de()] }],
			w: [{ w: [
				s,
				"screen",
				...le()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...le()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...le()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...le()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...le()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...le()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				gu,
				lu
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				Su,
				du
			] }],
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				$l,
				G
			] }],
			"font-family": [{ font: [
				_u,
				fu,
				t
			] }],
			"font-features": [{ "font-features": [G] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				K,
				G
			] }],
			"line-clamp": [{ "line-clamp": [
				Zl,
				"none",
				K,
				uu
			] }],
			leading: [{ leading: [a, ...C()] }],
			"list-image": [{ "list-image": [
				"none",
				K,
				G
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				K,
				G
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: w() }],
			"text-color": [{ text: w() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...ve(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				Zl,
				"from-font",
				"auto",
				K,
				lu
			] }],
			"text-decoration-color": [{ decoration: w() }],
			"underline-offset": [{ "underline-offset": [
				Zl,
				"auto",
				K,
				G
			] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: C() }],
			"tab-size": [{ tab: [
				Ql,
				K,
				G
			] }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				K,
				G
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: [
				"none",
				K,
				G
			] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: fe() }],
			"bg-repeat": [{ bg: pe() }],
			"bg-size": [{ bg: me() }],
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						Ql,
						K,
						G
					],
					radial: [
						"",
						K,
						G
					],
					conic: [
						Ql,
						K,
						G
					]
				},
				bu,
				mu
			] }],
			"bg-color": [{ bg: w() }],
			"gradient-from-pos": [{ from: he() }],
			"gradient-via-pos": [{ via: he() }],
			"gradient-to-pos": [{ to: he() }],
			"gradient-from": [{ from: w() }],
			"gradient-via": [{ via: w() }],
			"gradient-to": [{ to: w() }],
			rounded: [{ rounded: ge() }],
			"rounded-s": [{ "rounded-s": ge() }],
			"rounded-e": [{ "rounded-e": ge() }],
			"rounded-t": [{ "rounded-t": ge() }],
			"rounded-r": [{ "rounded-r": ge() }],
			"rounded-b": [{ "rounded-b": ge() }],
			"rounded-l": [{ "rounded-l": ge() }],
			"rounded-ss": [{ "rounded-ss": ge() }],
			"rounded-se": [{ "rounded-se": ge() }],
			"rounded-ee": [{ "rounded-ee": ge() }],
			"rounded-es": [{ "rounded-es": ge() }],
			"rounded-tl": [{ "rounded-tl": ge() }],
			"rounded-tr": [{ "rounded-tr": ge() }],
			"rounded-br": [{ "rounded-br": ge() }],
			"rounded-bl": [{ "rounded-bl": ge() }],
			"border-w": [{ border: _e() }],
			"border-w-x": [{ "border-x": _e() }],
			"border-w-y": [{ "border-y": _e() }],
			"border-w-s": [{ "border-s": _e() }],
			"border-w-e": [{ "border-e": _e() }],
			"border-w-bs": [{ "border-bs": _e() }],
			"border-w-be": [{ "border-be": _e() }],
			"border-w-t": [{ "border-t": _e() }],
			"border-w-r": [{ "border-r": _e() }],
			"border-w-b": [{ "border-b": _e() }],
			"border-w-l": [{ "border-l": _e() }],
			"divide-x": [{ "divide-x": _e() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": _e() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...ve(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...ve(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: w() }],
			"border-color-x": [{ "border-x": w() }],
			"border-color-y": [{ "border-y": w() }],
			"border-color-s": [{ "border-s": w() }],
			"border-color-e": [{ "border-e": w() }],
			"border-color-bs": [{ "border-bs": w() }],
			"border-color-be": [{ "border-be": w() }],
			"border-color-t": [{ "border-t": w() }],
			"border-color-r": [{ "border-r": w() }],
			"border-color-b": [{ "border-b": w() }],
			"border-color-l": [{ "border-l": w() }],
			"divide-color": [{ divide: w() }],
			"outline-style": [{ outline: [
				...ve(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				Zl,
				K,
				G
			] }],
			"outline-w": [{ outline: [
				"",
				Zl,
				gu,
				lu
			] }],
			"outline-color": [{ outline: w() }],
			shadow: [{ shadow: [
				"",
				"none",
				u,
				xu,
				hu
			] }],
			"shadow-color": [{ shadow: w() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				xu,
				hu
			] }],
			"inset-shadow-color": [{ "inset-shadow": w() }],
			"ring-w": [{ ring: _e() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: w() }],
			"ring-offset-w": [{ "ring-offset": [Zl, lu] }],
			"ring-offset-color": [{ "ring-offset": w() }],
			"inset-ring-w": [{ "inset-ring": _e() }],
			"inset-ring-color": [{ "inset-ring": w() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				xu,
				hu
			] }],
			"text-shadow-color": [{ "text-shadow": w() }],
			opacity: [{ opacity: [
				Zl,
				K,
				G
			] }],
			"mix-blend": [{ "mix-blend": [
				...ye(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": ye() }],
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			"mask-image-linear-pos": [{ "mask-linear": [Zl] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": be() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": be() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": w() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": w() }],
			"mask-image-t-from-pos": [{ "mask-t-from": be() }],
			"mask-image-t-to-pos": [{ "mask-t-to": be() }],
			"mask-image-t-from-color": [{ "mask-t-from": w() }],
			"mask-image-t-to-color": [{ "mask-t-to": w() }],
			"mask-image-r-from-pos": [{ "mask-r-from": be() }],
			"mask-image-r-to-pos": [{ "mask-r-to": be() }],
			"mask-image-r-from-color": [{ "mask-r-from": w() }],
			"mask-image-r-to-color": [{ "mask-r-to": w() }],
			"mask-image-b-from-pos": [{ "mask-b-from": be() }],
			"mask-image-b-to-pos": [{ "mask-b-to": be() }],
			"mask-image-b-from-color": [{ "mask-b-from": w() }],
			"mask-image-b-to-color": [{ "mask-b-to": w() }],
			"mask-image-l-from-pos": [{ "mask-l-from": be() }],
			"mask-image-l-to-pos": [{ "mask-l-to": be() }],
			"mask-image-l-from-color": [{ "mask-l-from": w() }],
			"mask-image-l-to-color": [{ "mask-l-to": w() }],
			"mask-image-x-from-pos": [{ "mask-x-from": be() }],
			"mask-image-x-to-pos": [{ "mask-x-to": be() }],
			"mask-image-x-from-color": [{ "mask-x-from": w() }],
			"mask-image-x-to-color": [{ "mask-x-to": w() }],
			"mask-image-y-from-pos": [{ "mask-y-from": be() }],
			"mask-image-y-to-pos": [{ "mask-y-to": be() }],
			"mask-image-y-from-color": [{ "mask-y-from": w() }],
			"mask-image-y-to-color": [{ "mask-y-to": w() }],
			"mask-image-radial": [{ "mask-radial": [K, G] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": be() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": be() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": w() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": w() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [Zl] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": be() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": be() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": w() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": w() }],
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			"mask-position": [{ mask: fe() }],
			"mask-repeat": [{ mask: pe() }],
			"mask-size": [{ mask: me() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				K,
				G
			] }],
			filter: [{ filter: [
				"",
				"none",
				K,
				G
			] }],
			blur: [{ blur: xe() }],
			brightness: [{ brightness: [
				Zl,
				K,
				G
			] }],
			contrast: [{ contrast: [
				Zl,
				K,
				G
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				xu,
				hu
			] }],
			"drop-shadow-color": [{ "drop-shadow": w() }],
			grayscale: [{ grayscale: [
				"",
				Zl,
				K,
				G
			] }],
			"hue-rotate": [{ "hue-rotate": [
				Zl,
				K,
				G
			] }],
			invert: [{ invert: [
				"",
				Zl,
				K,
				G
			] }],
			saturate: [{ saturate: [
				Zl,
				K,
				G
			] }],
			sepia: [{ sepia: [
				"",
				Zl,
				K,
				G
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				K,
				G
			] }],
			"backdrop-blur": [{ "backdrop-blur": xe() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				Zl,
				K,
				G
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				Zl,
				K,
				G
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				Zl,
				K,
				G
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				Zl,
				K,
				G
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				Zl,
				K,
				G
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				Zl,
				K,
				G
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				Zl,
				K,
				G
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				Zl,
				K,
				G
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": C() }],
			"border-spacing-x": [{ "border-spacing-x": C() }],
			"border-spacing-y": [{ "border-spacing-y": C() }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				K,
				G
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				Zl,
				"initial",
				K,
				G
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				K,
				G
			] }],
			delay: [{ delay: [
				Zl,
				K,
				G
			] }],
			animate: [{ animate: [
				"none",
				v,
				K,
				G
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				K,
				G
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: Se() }],
			"rotate-x": [{ "rotate-x": Se() }],
			"rotate-y": [{ "rotate-y": Se() }],
			"rotate-z": [{ "rotate-z": Se() }],
			scale: [{ scale: Ce() }],
			"scale-x": [{ "scale-x": Ce() }],
			"scale-y": [{ "scale-y": Ce() }],
			"scale-z": [{ "scale-z": Ce() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: we() }],
			"skew-x": [{ "skew-x": we() }],
			"skew-y": [{ "skew-y": we() }],
			transform: [{ transform: [
				K,
				G,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: Te() }],
			"translate-x": [{ "translate-x": Te() }],
			"translate-y": [{ "translate-y": Te() }],
			"translate-z": [{ "translate-z": Te() }],
			"translate-none": ["translate-none"],
			zoom: [{ zoom: [
				Ql,
				K,
				G
			] }],
			accent: [{ accent: w() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: w() }],
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				K,
				G
			] }],
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scrollbar-thumb-color": [{ "scrollbar-thumb": w() }],
			"scrollbar-track-color": [{ "scrollbar-track": w() }],
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			"scroll-m": [{ "scroll-m": C() }],
			"scroll-mx": [{ "scroll-mx": C() }],
			"scroll-my": [{ "scroll-my": C() }],
			"scroll-ms": [{ "scroll-ms": C() }],
			"scroll-me": [{ "scroll-me": C() }],
			"scroll-mbs": [{ "scroll-mbs": C() }],
			"scroll-mbe": [{ "scroll-mbe": C() }],
			"scroll-mt": [{ "scroll-mt": C() }],
			"scroll-mr": [{ "scroll-mr": C() }],
			"scroll-mb": [{ "scroll-mb": C() }],
			"scroll-ml": [{ "scroll-ml": C() }],
			"scroll-p": [{ "scroll-p": C() }],
			"scroll-px": [{ "scroll-px": C() }],
			"scroll-py": [{ "scroll-py": C() }],
			"scroll-ps": [{ "scroll-ps": C() }],
			"scroll-pe": [{ "scroll-pe": C() }],
			"scroll-pbs": [{ "scroll-pbs": C() }],
			"scroll-pbe": [{ "scroll-pbe": C() }],
			"scroll-pt": [{ "scroll-pt": C() }],
			"scroll-pr": [{ "scroll-pr": C() }],
			"scroll-pb": [{ "scroll-pb": C() }],
			"scroll-pl": [{ "scroll-pl": C() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				K,
				G
			] }],
			fill: [{ fill: ["none", ...w()] }],
			"stroke-w": [{ stroke: [
				Zl,
				gu,
				lu,
				uu
			] }],
			stroke: [{ stroke: ["none", ...w()] }],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
}, Pu = (e, { cacheSize: t, prefix: n, experimentalParseClassName: r, extend: i = {}, override: a = {} }) => (Fu(e, "cacheSize", t), Fu(e, "prefix", n), Fu(e, "experimentalParseClassName", r), Iu(e.theme, a.theme), Iu(e.classGroups, a.classGroups), Iu(e.conflictingClassGroups, a.conflictingClassGroups), Iu(e.conflictingClassGroupModifiers, a.conflictingClassGroupModifiers), Fu(e, "postfixLookupClassGroups", a.postfixLookupClassGroups), Fu(e, "orderSensitiveModifiers", a.orderSensitiveModifiers), Lu(e.theme, i.theme), Lu(e.classGroups, i.classGroups), Lu(e.conflictingClassGroups, i.conflictingClassGroups), Lu(e.conflictingClassGroupModifiers, i.conflictingClassGroupModifiers), Ru(e, i, "postfixLookupClassGroups"), Ru(e, i, "orderSensitiveModifiers"), e), Fu = (e, t, n) => {
	n !== void 0 && (e[t] = n);
}, Iu = (e, t) => {
	if (t) for (let n in t) Fu(e, n, t[n]);
}, Lu = (e, t) => {
	if (t) for (let n in t) Ru(e, t, n);
}, Ru = (e, t, n) => {
	let r = t[n];
	r !== void 0 && (e[n] = e[n] ? e[n].concat(r) : r);
}, zu = (e, ...t) => typeof e == "function" ? zl(Nu, e, ...t) : zl(() => Pu(Nu(), e), ...t), Bu = /* @__PURE__ */ zl(Nu), Vu = (e) => Qc(e) ? Bu : zu({
	...e,
	extend: {
		theme: e.theme,
		classGroups: e.classGroups,
		conflictingClassGroupModifiers: e.conflictingClassGroupModifiers,
		conflictingClassGroups: e.conflictingClassGroups,
		...e.extend
	}
}), Hu = (e, t) => {
	let n = Xc(e);
	return !n || !(t?.twMerge ?? !0) ? n : ((!ol.cachedTwMerge || ol.didTwMergeConfigChange) && (ol.didTwMergeConfigChange = !1, ol.cachedTwMerge = Vu(ol.cachedTwMergeConfig)), ol.cachedTwMerge(n) || void 0);
}, { createTV: Uu, tv: Wu } = sl((...e) => (t) => Hu(e, t)), Gu = /* @__PURE__ */ Ki("<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path></path></svg>");
function Ku(e, t) {
	Kt(t, !0);
	let n = Wu({
		base: "fill-current",
		variants: { size: {
			16: "size-4",
			18: "size-[18px]",
			20: "size-5",
			22: "size-[22px]",
			24: "size-6",
			28: "size-7",
			32: "size-8",
			36: "size-9",
			40: "size-10",
			44: "size-11",
			48: "size-12",
			128: "size-32"
		} },
		defaultVariants: { size: "24" }
	});
	var r = Gu(), i = A(r);
	E(r), N((e) => {
		z(r, 0, e), mo(i, "d", t.d);
	}, [() => R(n({
		size: t.size,
		class: t.class
	}))]), I(e, r), qt();
}
//#endregion
//#region src/assets/icons/customTranslatePath.ts
var qu = "M 17.308,7.6439998 C 16.636,9.4359998 15.66,10.732 14.604,11.74 14.428,10.812 14.316,9.8359998 14.316,8.8119998 l 0.016,-0.656 c 0.736,-0.272 1.664,-0.512 2.704,-0.512 z m 1.824,-1.76 -1.264,-0.32 c -0.016,0.272 -0.096,0.688 -0.176,0.928 l -0.048,0.16 -0.592,-0.016 c -0.816,0 -1.792,0.144 -2.688,0.4 0.048,-0.672 0.096,-1.344 0.16,-1.968 1.968,-0.096 4.096,-0.32 5.776,-0.608 l -0.016,-1.184 c -1.632,0.384 -3.584,0.592 -5.616,0.688 l 0.192,-1.216 c 0.048,-0.224 0.112,-0.512 0.192,-0.72 l -1.344,-0.032 c 0.016,0.192 -0.016,0.48 -0.032,0.768 l -0.128,1.232 -1.088,0.016 c -0.688,0 -2.08,-0.112 -2.64,-0.208 l 0.032,1.2 c 0.656,0.048 1.904,0.112 2.592,0.112 l 0.976,-0.016 c -0.064,0.752 -0.144,1.552 -0.176,2.352 -2.208,1.024 -4,3.1200002 -4,5.1840002 0,1.36 0.832,2.016 1.888,2.016 0.88,0 1.84,-0.352 2.72,-0.88 l 0.256,0.896 1.152,-0.352 c -0.128,-0.4 -0.256,-0.832 -0.384,-1.296 1.36,-1.152 2.656,-2.928 3.568,-5.2000002 1.488,0.432 2.304,1.52 2.304,2.7360002 0,2.08 -1.792,3.568 -4.688,3.872 l 0.688,1.072 c 3.712,-0.592 5.232,-2.576 5.232,-4.88 0,-1.7600002 -1.184,-3.2320002 -3.184,-3.7600002 l 0.016,-0.064 c 0.08,-0.256 0.224,-0.688 0.32,-0.912 z m -5.936,2.768 v 0.288 C 13.196,10.14 13.356,11.436 13.58,12.572 c -0.816,0.576 -1.584,0.848 -2.208,0.848 -0.608,0 -0.912,-0.336 -0.912,-0.992 0,-1.312 1.184,-2.8960002 2.736,-3.7760002 z M 1.964,22 H 3.452 L 4.588,18.416 H 8.876 L 9.996,22 h 1.568 L 7.58,10.272 H 5.932 Z M 4.956,17.248 5.532,15.44 c 0.416,-1.328 0.8,-2.592 1.168,-3.968 h 0.064 c 0.384,1.36 0.752,2.64 1.184,3.968 l 0.56,1.808 z", Ju = /* @__PURE__ */ F("<div class=\"absolute z-999999999\"><button type=\"button\"><span></span> <!></button></div>");
function Yu(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ D(() => U.motionDisabled ? 0 : 150), r = /* @__PURE__ */ D(() => ({ getBoundingClientRect: () => W.selectedEndCoord || new DOMRect() })), i = (e) => {
		jr(() => {
			W.selectedEndCoord && qc(P(r), e, {
				strategy: "absolute",
				placement: "bottom-end",
				middleware: [Wc(({ rects: e }) => ({
					mainAxis: 4,
					alignmentAxis: -e.floating.width
				})), Kc()]
			}).then(({ x: t, y: n }) => {
				Object.assign(e.style, {
					left: `${t}px`,
					top: `${n}px`
				});
			});
		});
	};
	var a = Ju(), o = A(a);
	z(o, 1, R(["group relative flex items-center justify-center rounded-lg p-1 shadow-md transition-colors ease-effects-fast", "bg-color-surface-container text-color-on-surface-variant hover:text-color-on-surface"])), mo(o, "aria-label", l.i18n.getMessage("tooltip_translate_text")), mo(o, "title", l.i18n.getMessage("tooltip_translate_text"));
	var s = A(o);
	z(s, 1, R(["pointer-events-none absolute inset-0 rounded-[inherit] bg-color-on-surface opacity-0 transition-opacity ease-effects-fast", "group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed group-disabled:opacity-disabled"])), Ku(M(s, 2), {
		get d() {
			return qu;
		},
		size: "22"
	}), E(o), E(a), Ua(a, (e) => i?.(e)), Li("click", o, function(...e) {
		W.openPopup?.apply(this, e);
	}), Va(1, a, () => ls, () => ({ duration: P(n) })), I(e, a), qt();
}
Ri(["click"]);
var Xu = new class {
	#e = /* @__PURE__ */ O(!1);
	get dragging() {
		return P(this.#e);
	}
	set dragging(e) {
		k(this.#e, e, !0);
	}
	#t = /* @__PURE__ */ O(!1);
	get resizing() {
		return P(this.#t);
	}
	set resizing(e) {
		k(this.#t, e, !0);
	}
}(), Zu = { classGroups: {
	rounded: [
		"rounded-20",
		"rounded-28",
		"rounded-48"
	],
	w: ["w-13", "w-18"],
	h: ["h-13", "h-18"],
	size: ["size-13", "size-18"]
} }, Qu = (e, t) => Wu(e, {
	...t,
	twMergeConfig: {
		...t?.twMergeConfig,
		classGroups: {
			...t?.twMergeConfig?.classGroups,
			...Zu.classGroups
		}
	}
}), $u = /* @__PURE__ */ F("<button><span></span> <span aria-hidden=\"true\"><!></span></button>");
function ed(e, t) {
	Kt(t, !0);
	let n = Qu({
		slots: {
			base: [
				"group relative flex cursor-pointer items-center justify-center select-none transition-shape-colors",
				"outline-color-secondary focus-visible:outline-common",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				"disabled:pointer-events-none disabled:cursor-default",
				"transform-gpu"
			],
			stateLayer: ["pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity ease-effects-fast", "group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed"],
			iconClass: "relative flex items-center group-disabled:text-color-on-surface group-disabled:opacity-disabled"
		},
		variants: {
			color: {
				filled: {
					base: "bg-color-primary disabled:bg-color-on-surface/10",
					iconClass: "text-color-on-primary",
					stateLayer: "bg-color-on-primary"
				},
				tonal: {
					base: "bg-color-secondary disabled:bg-color-on-surface/10",
					iconClass: "text-color-on-secondary",
					stateLayer: "bg-color-on-secondary"
				},
				outlined: {
					base: "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-color-outline-variant",
					iconClass: "text-color-on-surface-variant",
					stateLayer: "bg-color-on-surface-variant"
				},
				standard: {
					iconClass: "text-color-on-surface-variant group-disabled:text-color-on-surface",
					stateLayer: "bg-color-on-surface-variant"
				}
			},
			size: {
				xs: {
					base: "h-8 rounded-2xl",
					iconClass: "[&_svg]:size-5"
				},
				sm: {
					base: "h-10 rounded-20",
					iconClass: "[&_svg]:size-6"
				},
				md: {
					base: "h-14 rounded-28",
					iconClass: "[&_svg]:size-6"
				},
				lg: {
					base: "h-24 rounded-48",
					iconClass: "[&_svg]:size-8"
				}
			},
			toggle: { true: "" },
			width: {
				narrow: "",
				default: "",
				wide: ""
			},
			shape: {
				round: "",
				square: ""
			},
			shapeMorph: { true: "" },
			active: { true: { stateLayer: "opacity-pressed!" } }
		},
		compoundVariants: [
			{
				color: "filled",
				toggle: !0,
				class: {
					base: "bg-color-surface-container aria-pressed:bg-color-primary",
					iconClass: "text-color-on-surface-variant group-aria-pressed:text-color-on-primary",
					stateLayer: "bg-color-on-surface-variant group-aria-pressed:bg-color-on-primary"
				}
			},
			{
				color: "tonal",
				toggle: !0,
				class: {
					base: "bg-color-secondary-container aria-pressed:bg-color-secondary",
					iconClass: "text-color-on-secondary-container group-aria-pressed:text-color-on-secondary",
					stateLayer: "bg-color-on-secondary-container group-aria-pressed:bg-color-on-secondary"
				}
			},
			{
				color: "outlined",
				toggle: !0,
				class: {
					base: "aria-pressed:bg-color-inverse-surface aria-pressed:before:border-color-inverse-surface",
					iconClass: "text-color-on-surface-variant group-aria-pressed:text-color-inverse-on-surface",
					stateLayer: "bg-color-on-surface-variant group-aria-pressed:bg-color-inverse-on-surface"
				}
			},
			{
				color: "standard",
				toggle: !0,
				class: {
					iconClass: "text-color-on-surface-variant group-aria-pressed:text-color-primary",
					stateLayer: "bg-color-on-surface-variant group-aria-pressed:bg-color-primary"
				}
			},
			{
				size: "xs",
				width: "narrow",
				class: "w-7"
			},
			{
				size: "xs",
				width: "default",
				class: "w-8"
			},
			{
				size: "xs",
				width: "wide",
				class: "w-10"
			},
			{
				size: "sm",
				width: "narrow",
				class: "w-8"
			},
			{
				size: "sm",
				width: "default",
				class: "w-10"
			},
			{
				size: "sm",
				width: "wide",
				class: "w-13"
			},
			{
				size: "md",
				width: "narrow",
				class: "w-12"
			},
			{
				size: "md",
				width: "default",
				class: "w-14"
			},
			{
				size: "md",
				width: "wide",
				class: "w-18"
			},
			{
				size: "lg",
				width: "narrow",
				class: "w-16"
			},
			{
				size: "lg",
				width: "default",
				class: "w-24"
			},
			{
				size: "lg",
				width: "wide",
				class: "w-32"
			},
			{
				shape: "round",
				toggle: !0,
				size: "xs",
				class: "aria-pressed:rounded-xl"
			},
			{
				shape: "round",
				toggle: !0,
				size: "sm",
				class: "aria-pressed:rounded-xl"
			},
			{
				shape: "round",
				toggle: !0,
				size: "md",
				class: "aria-pressed:rounded-2xl"
			},
			{
				shape: "round",
				toggle: !0,
				size: "lg",
				class: "aria-pressed:rounded-28"
			},
			{
				shape: "square",
				size: "xs",
				class: "rounded-xl aria-pressed:rounded-2xl"
			},
			{
				shape: "square",
				size: "sm",
				class: "rounded-xl aria-pressed:rounded-20"
			},
			{
				shape: "square",
				size: "md",
				class: "rounded-2xl aria-pressed:rounded-28"
			},
			{
				shape: "square",
				size: "lg",
				class: "rounded-28 aria-pressed:rounded-48"
			},
			{
				shapeMorph: !0,
				size: ["xs", "sm"],
				class: "enabled:active:rounded-lg"
			},
			{
				shapeMorph: !0,
				size: "md",
				class: "enabled:active:rounded-xl"
			},
			{
				shapeMorph: !0,
				size: "lg",
				class: "enabled:active:rounded-2xl"
			},
			{
				color: "outlined",
				size: "lg",
				class: "before:border-2"
			}
		],
		defaultVariants: {
			color: "filled",
			toggle: !1,
			size: "sm"
		}
	}), r = H(t, "ref", 15, null), i = H(t, "type", 3, "button"), a = H(t, "size", 3, "sm"), o = H(t, "toggle", 3, !1), s = H(t, "selected", 15, !1), c = H(t, "color", 3, "filled"), l = H(t, "shape", 3, "round"), u = H(t, "width", 3, "default"), d = H(t, "aria-label", 19, () => t.title), f = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy",
		"title",
		"children",
		"ref",
		"type",
		"class",
		"size",
		"toggle",
		"selected",
		"selectedIcon",
		"color",
		"shape",
		"width",
		"shapeMorph",
		"active",
		"aria-label",
		"onclick"
	]), p = /* @__PURE__ */ D(() => o() ? s() : void 0), m = (e) => {
		o() && s(!s()), t.onclick?.(e);
	}, { base: h, stateLayer: g, iconClass: _ } = n();
	var v = $u();
	B(v, (e) => ({
		class: e,
		"aria-label": d(),
		"aria-pressed": P(p),
		onclick: m,
		title: t.title,
		type: i(),
		...f
	}), [() => h({
		size: a(),
		width: u(),
		color: c(),
		toggle: o(),
		shape: l(),
		shapeMorph: t.shapeMorph,
		class: t.class
	})]);
	var y = A(v), b = M(y, 2), x = A(b), ee = (e) => {
		var n = Ji();
		da(j(n), () => t.selectedIcon, s), I(e, n);
	}, S = (e) => {
		var n = Ji();
		da(j(n), () => t.children, s), I(e, n);
	};
	L(x, (e) => {
		s() && t.selectedIcon ? e(ee) : e(S, -1);
	}), E(b), E(v), Co(v, (e) => r(e), () => r()), N((e, t) => {
		z(y, 1, e), z(b, 1, t);
	}, [() => R(g({
		color: c(),
		toggle: o(),
		active: t.active
	})), () => R(_({
		size: a(),
		color: c(),
		toggle: o()
	}))]), I(e, v), qt();
}
//#endregion
//#region node_modules/.pnpm/bezier-easing@3.0.0/node_modules/bezier-easing/src/index.js
function td(e) {
	return e;
}
var { cbrt: nd, sqrt: rd, PI: id } = Math, ad = (e, t, n, r, i) => {
	let a = t + n * e, o = a ** 2 + r;
	if (o > 0) {
		let e = rd(o);
		return nd(a + e) + nd(a - e) - i;
	}
	let s = nd(rd(a * a - o)), c = a ? Math.atan(rd(-o) / a) : -id / 2, l;
	return l = n < 0 ? (a > 0 ? 2 * id : id) - c : i < 0 ? (a > 0 ? 2 * id : -3 * id) + c : (a > 0 ? 0 : id) + c, 2 * s * Math.cos(l / 3) - i;
}, od = (e, t, n, r) => ((t * e + 3 * n) * e + r) * e;
function sd(e, t, n, r) {
	if (!(0 <= e && e <= 1 && 0 <= n && n <= 1)) throw Error("bezier x values must be in [0, 1] range");
	if (e === t && n === r) return td;
	let i = 6 * (3 * e - 3 * n + 1), a = 6 * (n - 2 * e), o = 3 * e, s = i * i, c = a * a, l = a / i, u = 3 * a * o / s - c * a / (s * i), d = 2 * o / i - c / s, f = d * d * d, p = 3 / i, m = 3 * t - 3 * r + 1, h = r - 2 * t, g = 3 * t, _ = i ? ad : td;
	return function(e) {
		return e === 0 || e === 1 ? e : od(_(e, u, p, f, l), m, h, g);
	};
}
sd(.31, .94, .34, 1), sd(.34, .8, .34, 1);
var cd = "cubic-bezier(0.34, 0.80, 0.34, 1.00)", ld = sd(.34, .88, .34, 1), ud = sd(.42, 1.67, .21, .9);
sd(.38, 1.21, .22, 1);
var dd = "cubic-bezier(0.38, 1.21, 0.22, 1.00)";
sd(.39, 1.29, .35, .98), sd(.27, 1.06, .18, 1);
//#endregion
//#region src/lib/base/types/keyCodes.ts
var fd = /* @__PURE__ */ function(e) {
	return e.Space = "Space", e.Enter = "Enter", e.Escape = "Escape", e.ArrowUp = "ArrowUp", e.ArrowRight = "ArrowRight", e.ArrowDown = "ArrowDown", e.ArrowLeft = "ArrowLeft", e.Home = "Home", e.End = "End", e.PageUp = "PageUp", e.PageDown = "PageDown", e.Tab = "Tab", e.Backspace = "Backspace", e;
}({}), pd = /* @__PURE__ */ function(e) {
	return e.First = "first", e.Prev = "prev", e.Next = "next", e.Last = "last", e;
}({});
function md(e) {
	let t = document.activeElement?.shadowRoot?.activeElement ?? document.activeElement;
	return e.indexOf(t);
}
function hd(e, t, n) {
	switch (e) {
		case pd.First: return 0;
		case pd.Last: return n - 1;
		case pd.Next: return t === -1 ? 0 : (t + 1) % n;
		case pd.Prev: return t === -1 ? n - 1 : (t - 1 + n) % n;
	}
}
function gd(e, t) {
	e[hd(t, md(e), e.length)]?.focus();
}
//#endregion
//#region src/lib/base/utils/getItems.ts
function _d(e, t) {
	return Array.from(e?.querySelectorAll(`[role="${t}"]:not([aria-disabled])`) ?? []);
}
//#endregion
//#region src/lib/base/utils/transition.ts
function vd(e, { duration: t = 500, animateChildSelector: n, easingRoot: r = dd, easingChild: i = dd, onEnd: a } = {}, { direction: o } = { direction: "both" }) {
	e._slideAnimations?.forEach((e) => e.cancel());
	let s = getComputedStyle(e), c = e.scrollHeight, l = parseFloat(s.maxHeight), u = c > l ? l : c, d = o === "in", f = u * .2, p = d ? r : cd, m = d ? i : cd, h = e.animate({ height: d ? [`${f}px`, `${u}px`] : [`${u}px`, `${f}px`] }, {
		duration: t,
		easing: p,
		fill: "forwards"
	});
	if (n) {
		let r = e.querySelector(n);
		if (r) {
			r._slideAnimations?.forEach((e) => e.cancel()), r.style.overflowY = "";
			let e = r.animate({ transform: d ? ["translateY(-80%)", "translateY(0%)"] : ["translateY(0%)", "translateY(-80%)"] }, {
				duration: t,
				easing: m,
				fill: "forwards"
			});
			e.finished.then(() => {
				o === "in" && (r.style.overflowY = "auto", a?.());
			}).catch(() => {}), r._slideAnimations = [e];
		}
	}
	return e._slideAnimations = [h, e.animate({ opacity: d ? [0, 1] : [1, 0] }, {
		duration: d ? t * .5 : t * .75,
		easing: cd,
		fill: "forwards"
	})], {
		duration: t,
		easing: (e) => e,
		css: () => `overflow: hidden; max-height: ${l + 10}px;`
	};
}
//#endregion
//#region src/lib/base/Menu/context.ts
var [yd, bd] = Ht(), xd = {
	start: "left-0",
	end: "right-0",
	center: "left-1/2 -translate-x-1/2"
}, Sd = /* @__PURE__ */ F("<div><ul><!></ul></div>");
function Cd(e, t) {
	Kt(t, !0);
	let n = H(t, "open", 15, !1), r = H(t, "triggerRef", 3, null), i = H(t, "color", 3, "standard"), a = H(t, "align", 3, "start"), o = H(t, "quick", 3, !1), s = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy",
		"open",
		"children",
		"triggerRef",
		"color",
		"align",
		"quick"
	]), c = /* @__PURE__ */ O(null), l = /* @__PURE__ */ D(() => xd[a()]), u = /* @__PURE__ */ D(() => o() ? 0 : 350), d = /* @__PURE__ */ D(() => o() ? 0 : 250);
	async function f() {
		n(!1), await Ti(), r()?.focus();
	}
	bd({
		close: f,
		get color() {
			return i();
		}
	});
	function p(e) {
		let t = _d(P(c), "menuitem");
		switch (e.code) {
			case fd.ArrowDown:
				e.preventDefault(), gd(t, pd.Next);
				break;
			case fd.ArrowUp:
				e.preventDefault(), gd(t, pd.Prev);
				break;
			case fd.Home:
				e.preventDefault(), gd(t, pd.First);
				break;
			case fd.End:
				e.preventDefault(), gd(t, pd.Last);
				break;
			case fd.Tab:
				n(!1);
				break;
			case fd.Escape:
				f();
				break;
		}
	}
	jr(() => {
		n() && Ti().then(() => {
			_d(P(c), "menuitem")[0]?.focus({ preventScroll: !0 });
		});
	});
	var m = Ji(), h = j(m), g = (e) => {
		var n = Sd(), r = A(n);
		B(r, () => ({
			id: "animate-child",
			class: ["flex flex-1 flex-col justify-between gap-0.5 overflow-x-clip p-1 select-none", "scrollbar focus:outline-none"],
			onkeydown: p,
			...s,
			role: "menu",
			tabindex: "-1"
		})), da(A(r), () => t.children), E(r), Co(r, (e) => k(c, e), () => P(c)), E(n), N(() => z(n, 1, R([
			"absolute top-full z-20 flex max-h-80 flex-col overflow-hidden rounded-2xl shadow-sm",
			i() === "standard" ? "bg-color-surface-container-low" : "bg-color-tertiary-container",
			P(l)
		]))), Va(1, n, () => vd, () => ({
			duration: P(u),
			animateChildSelector: "#animate-child"
		})), Va(2, n, () => vd, () => ({
			duration: P(d),
			animateChildSelector: "#animate-child"
		})), I(e, n);
	};
	L(h, (e) => {
		n() && e(g);
	}), I(e, m), qt();
}
//#endregion
//#region src/lib/base/Menu/MenuItem.svelte
var wd = /* @__PURE__ */ F("<span aria-hidden=\"true\"><!></span>"), Td = /* @__PURE__ */ F("<span aria-hidden=\"true\"><!></span>"), Ed = /* @__PURE__ */ F("<li role=\"menuitem\" tabindex=\"-1\"><span></span> <div><!> <span> </span> <!></div></li>");
function Dd(e, t) {
	Kt(t, !0);
	let n = Qu({
		slots: {
			base: [
				"group relative flex min-w-40 shrink-0 cursor-pointer px-3",
				"rounded-sm first:rounded-t-xl last:rounded-b-xl",
				"outline-color-secondary focus-visible:outline-menu",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				"aria-disabled:pointer-events-none aria-disabled:opacity-disabled"
			],
			stateLayer: ["pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity ease-effects-fast", "group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed"],
			content: "relative flex w-full items-center gap-2",
			iconClass: "[&_svg]:size-5 [&:not(:has(svg))]:hidden",
			labelClass: "flex-1 text-sm font-medium whitespace-nowrap"
		},
		variants: {
			color: {
				standard: {
					iconClass: "text-color-on-surface-variant",
					labelClass: "text-color-on-surface",
					stateLayer: "bg-color-on-surface"
				},
				vibrant: {
					iconClass: "text-color-on-tertiary-container",
					labelClass: "text-color-on-tertiary-container",
					stateLayer: "bg-color-on-tertiary-container"
				}
			},
			size: {
				xs: "h-8",
				sm: "h-10"
			}
		},
		defaultVariants: {
			color: "standard",
			size: "sm"
		}
	}), r = yd(), i = H(t, "color", 19, () => r.color), a = H(t, "size", 3, "sm"), { base: o, stateLayer: s, content: c, iconClass: l, labelClass: u } = n();
	function d() {
		t.onclick(), t.keepOpen || r.close();
	}
	function f(e) {
		(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), d());
	}
	var p = Ed(), m = A(p), h = M(m, 2), g = A(h), _ = (e) => {
		var n = wd();
		da(A(n), () => t.leadingIcon), E(n), N((e) => z(n, 1, e), [() => R(l({ color: i() }))]), I(e, n);
	};
	L(g, (e) => {
		t.leadingIcon && e(_);
	});
	var v = M(g, 2), y = A(v, !0);
	E(v);
	var b = M(v, 2), x = (e) => {
		var n = Td();
		da(A(n), () => t.trailingIcon), E(n), N((e) => z(n, 1, e), [() => R(l({ color: i() }))]), I(e, n);
	};
	L(b, (e) => {
		t.trailingIcon && e(x);
	}), E(h), E(p), N((e, n, r, i) => {
		z(p, 1, e), mo(p, "aria-disabled", t.disabled || void 0), z(m, 1, n), z(h, 1, r), z(v, 1, i), ia(y, t.label);
	}, [
		() => R(o({ size: a() })),
		() => R(s({ color: i() })),
		() => R(c()),
		() => R(u({ color: i() }))
	]), Li("click", p, d), Li("keydown", p, f), I(e, p), qt();
}
Ri(["click", "keydown"]);
//#endregion
//#region src/entrypoints/background/providers/google.ts
var Od = ({ sl: e = "auto", tl: t = "auto", text: n = "" }) => `https://translate.google.com/?${new URLSearchParams({
	sl: e,
	tl: t,
	text: n
})}`, kd = (e, t) => {
	jr(() => {
		let n = (n) => {
			let r = n.button === 0;
			if (!n.target || !r) return;
			let i = n.composedPath(), a = n.target, o = i.includes(e) || e.contains(a), s = t?.exclude && (i.includes(t.exclude) || t.exclude.contains(a));
			!o && !s && e.dispatchEvent(new CustomEvent("clickoutside"));
		};
		return document.addEventListener("mousedown", n, !0), () => {
			document.removeEventListener("mousedown", n, !0);
		};
	});
}, Ad = l.i18n.getUILanguage();
new Intl.RelativeTimeFormat(Ad, { numeric: "auto" }), new Intl.DateTimeFormat(Ad, {
	day: "numeric",
	month: "long",
	year: "numeric"
});
//#endregion
//#region ~icons/material-symbols/more-vert.svelte
var jd = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M12 20q-.825 0-1.412-.587T10 18t.588-1.412T12 16t1.413.588T14 18t-.587 1.413T12 20m0-6q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m0-6q-.825 0-1.412-.587T10 6t.588-1.412T12 4t1.413.588T14 6t-.587 1.413T12 8\"></path></svg>");
function Md(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = jd();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/swap-vert-rounded.svelte
var Nd = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M8.288 12.713Q8 12.425 8 12V5.825L6.125 7.7q-.275.275-.687.275T4.725 7.7q-.3-.3-.3-.712t.3-.713L8.3 2.7q.15-.15.325-.213T9 2.425t.375.062t.325.213l3.6 3.6q.3.3.287.7t-.312.7q-.3.275-.7.288t-.7-.288L10 5.825V12q0 .425-.288.713T9 13t-.712-.288m6.337 8.8q-.175-.062-.325-.212l-3.6-3.6q-.3-.3-.287-.7t.312-.7q.3-.275.7-.288t.7.288L14 18.175V12q0-.425.288-.712T15 11t.713.288T16 12v6.175l1.875-1.875q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L15.7 21.3q-.15.15-.325.213t-.375.062t-.375-.062\"></path></svg>");
function Pd(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Nd();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/g-translate.svelte
var Fd = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"m12 22l-1-3H4q-.825 0-1.412-.587T2 17V4q0-.825.588-1.412T4 2h6l.875 3H20q.875 0 1.438.563T22 7v13q0 .825-.562 1.413T20 22zm-4.85-7.4q1.725 0 2.838-1.112T11.1 10.6q0-.2-.012-.362t-.063-.338h-3.95v1.55H9.3q-.2.7-.763 1.088t-1.362.387q-.975 0-1.675-.7T4.8 10.5t.7-1.725t1.675-.7q.45 0 .85.163t.725.487L9.975 7.55Q9.45 7 8.712 6.7T7.15 6.4q-1.675 0-2.863 1.188T3.1 10.5t1.188 2.913T7.15 14.6m6.7.5l.55-.525q-.35-.425-.637-.825t-.563-.85zm1.25-1.275q.7-.825 1.063-1.575t.487-1.175h-3.975l.3 1.05h1q.2.375.475.813t.65.887M13 21h7q.45 0 .725-.288T21 20V7q0-.45-.275-.725T20 6h-8.825l1.175 4.05h1.975V9h1.025v1.05H19v1.025h-1.275q-.25.95-.75 1.85T15.8 14.6l2.725 2.675L17.8 18l-2.7-2.7l-.9.925L15 19z\"></path></svg>");
function Id(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Fd();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/open-in-new-rounded.svelte
var Ld = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h14v-6q0-.425.288-.712T20 12t.713.288T21 13v6q0 .825-.587 1.413T19 21zM19 6.4L10.4 15q-.275.275-.7.275T9 15t-.275-.7t.275-.7L17.6 5H15q-.425 0-.712-.288T14 4t.288-.712T15 3h5q.425 0 .713.288T21 4v5q0 .425-.288.713T20 10t-.712-.288T19 9z\"></path></svg>");
function Rd(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Ld();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/lock-outline.svelte
var zd = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1t3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm0-2h12V10H6zm7.413-3.588Q14 15.826 14 15t-.587-1.412T12 13t-1.412.588T10 15t.588 1.413T12 17t1.413-.587M9 8h6V6q0-1.25-.875-2.125T12 3t-2.125.875T9 6zM6 20V10z\"></path></svg>");
function Bd(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = zd();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/lock-open-right-outline-rounded.svelte
var Vd = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M6 20h12V10H6zm7.413-3.588Q14 15.826 14 15t-.587-1.412T12 13t-1.412.588T10 15t.588 1.413T12 17t1.413-.587M6 20V10zm0 2q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h7V6q0-2.075 1.463-3.537T18 1q1.775 0 3.1 1.075t1.75 2.7q.125.425-.162.825T22 6q-.425 0-.7-.175t-.4-.575q-.275-.95-1.062-1.6T18 3q-1.25 0-2.125.875T15 6v2h3q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22z\"></path></svg>");
function Hd(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Vd();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/visibility-outline-rounded.svelte
var Ud = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M15.188 14.688Q16.5 13.375 16.5 11.5t-1.312-3.187T12 7T8.813 8.313T7.5 11.5t1.313 3.188T12 16t3.188-1.312m-5.1-1.276Q9.3 12.625 9.3 11.5t.788-1.912T12 8.8t1.913.788t.787 1.912t-.787 1.913T12 14.2t-1.912-.787m-4.2 3.787q-2.763-1.8-4.363-4.75q-.125-.225-.187-.462t-.063-.488t.063-.488t.187-.462q1.6-2.95 4.363-4.75T12 4t6.113 1.8t4.362 4.75q.125.225.188.463t.062.487t-.062.488t-.188.462q-1.6 2.95-4.362 4.75T12 19t-6.113-1.8m11.3-1.687Q19.55 14.025 20.8 11.5q-1.25-2.525-3.613-4.012T12 6T6.813 7.488T3.2 11.5q1.25 2.525 3.613 4.013T12 17t5.188-1.487\"></path></svg>");
function Wd(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Ud();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/visibility-off-outline-rounded.svelte
var Gd = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M15.175 8.325q.725.725 1.063 1.65t.237 1.9q0 .375-.275.638t-.65.262t-.638-.262t-.262-.638q.125-.65-.075-1.25T13.95 9.6t-1.025-.65t-1.275-.1q-.375 0-.638-.275t-.262-.65t.263-.637t.637-.263q.95-.1 1.875.238t1.65 1.062M12 6q-.475 0-.925.037t-.9.138q-.425.075-.763-.125t-.462-.6t.088-.775t.612-.45q.575-.125 1.163-.175T12 4q3.425 0 6.263 1.8t4.337 4.85q.1.2.15.413t.05.437t-.038.438t-.137.412q-.45 1-1.112 1.875t-1.463 1.6q-.3.275-.7.225t-.65-.4t-.212-.763t.337-.687q.6-.575 1.1-1.25t.875-1.45q-1.25-2.525-3.613-4.012T12 6m0 13q-3.35 0-6.125-1.812T1.5 12.425q-.125-.2-.187-.437T1.25 11.5t.05-.475t.175-.45q.5-1 1.163-1.912T4.15 7L2.075 4.9q-.275-.3-.262-.712T2.1 3.5t.7-.275t.7.275l17 17q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275l-3.5-3.45q-.875.275-1.775.413T12 19M5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.613 4.013T12 17q.5 0 .975-.062t.975-.138l-.9-.95q-.275.075-.525.113T12 16q-1.875 0-3.188-1.312T7.5 11.5q0-.275.038-.525t.112-.525zm4.2 4.2\"></path></svg>");
function Kd(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Gd();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/close-fullscreen-rounded.svelte
var qd = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"m10 15.4l-5.9 5.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7L8.6 14H5q-.425 0-.712-.288T4 13t.288-.712T5 12h6q.425 0 .713.288T12 13v6q0 .425-.288.713T11 20t-.712-.288T10 19zm5.4-5.4H19q.425 0 .713.288T20 11t-.288.713T19 12h-6q-.425 0-.712-.288T12 11V5q0-.425.288-.712T13 4t.713.288T14 5v3.6l5.9-5.9q.275-.275.7-.275t.7.275t.275.7t-.275.7z\"></path></svg>");
function Jd(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = qd();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/settings-outline-rounded.svelte
var Yd = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M10.825 22q-.675 0-1.162-.45t-.588-1.1L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.575-.375t.6-.3l.225-1.65q.1-.65.588-1.1T10.825 2h2.35q.675 0 1.163.45t.587 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-1.325 1q.025.175.025.338v.674q0 .163-.05.338l1.325 1q.525.425.675 1.075t-.2 1.225l-1.2 2.05q-.35.575-.975.8t-1.25-.05l-1.5-.65q-.275.2-.575.375t-.6.3l-.225 1.65q-.1.65-.587 1.1t-1.163.45zM11 20h1.975l.35-2.65q.775-.2 1.438-.587t1.212-.938l2.475 1.025l.975-1.7l-2.15-1.625q.125-.35.175-.737T17.5 12t-.05-.787t-.175-.738l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.212-.962t-1.438-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.55.575 1.213.963t1.437.587zm1.05-4.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.487 1.025T8.55 12t1.013 2.475T12.05 15.5M12 12\"></path></svg>");
function Xd(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Yd();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/splitscreen-portrait-outline-rounded.svelte
var Zd = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M9 18h6q.425 0 .713-.288T16 17v-3q0-.425-.288-.712T15 13H9q-.425 0-.712.288T8 14v3q0 .425.288.713T9 18m0-7h6q.425 0 .713-.288T16 10V7q0-.425-.288-.712T15 6H9q-.425 0-.712.288T8 7v3q0 .425.288.713T9 11m11 9q0 .825-.587 1.413T18 22H6q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4zm-2 0V4H6v16zm0-16H6z\"></path></svg>");
function Qd(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Zd();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/splitscreen-landscape-outline-rounded.svelte
var $d = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M14 16h3q.425 0 .713-.288T18 15V9q0-.425-.288-.712T17 8h-3q-.425 0-.712.288T13 9v6q0 .425.288.713T14 16m-7 0h3q.425 0 .713-.288T11 15V9q0-.425-.288-.712T10 8H7q-.425 0-.712.288T6 9v6q0 .425.288.713T7 16m-3 4q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zM20 6H4v12h16zM4 6v12z\"></path></svg>");
function ef(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = $d();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/Menu.svelte
var tf = /* @__PURE__ */ F("<!> <!> <div class=\"mx-2 my-1 h-px bg-color-outline-variant\"></div> <!> <!> <!> <!> <div class=\"mx-2 my-1 h-px bg-color-outline-variant\"></div> <!>", 1), nf = /* @__PURE__ */ F("<span class=\"relative cursor-default\"><!> <!></span>");
function rf(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ O(!1), r = /* @__PURE__ */ O(null), i = /* @__PURE__ */ D(() => U.settings.blacklistDomainForInline.includes(W.hostname)), a = /* @__PURE__ */ D(() => U.settings.popupLayout === Po.Horiz), o = () => k(n, !1), s = () => k(n, !P(n));
	function c() {
		U.settings.popupMode = No.Simple;
	}
	function u() {
		W.reverseTranslation(), o();
	}
	function d() {
		let e = Od({
			sl: U.settings.sourceLang,
			tl: U.settings.targetLang,
			text: W.textToTranslate
		});
		l.runtime.sendMessage({
			type: "openURL",
			content: { url: e }
		}), o();
	}
	function f() {
		U.settings.blacklistDomainForInline = P(i) ? U.settings.blacklistDomainForInline.filter((e) => e !== W.hostname) : [...U.settings.blacklistDomainForInline, W.hostname];
	}
	function p() {
		l.runtime.sendMessage({ type: "openOptionsPage" }), o();
	}
	function m() {
		U.settings.lockWindow = !U.settings.lockWindow;
	}
	function h() {
		U.settings.popupLayout = U.settings.popupLayout === Po.Vert ? Po.Horiz : Po.Vert;
	}
	var g = nf(), _ = A(g);
	ed(_, {
		get active() {
			return P(n);
		},
		color: "standard",
		onclick: s,
		size: "xs",
		title: "menu",
		get ref() {
			return P(r);
		},
		set ref(e) {
			k(r, e, !0);
		},
		children: (e, t) => {
			Md(e, {});
		},
		$$slots: { default: !0 }
	}), Cd(M(_, 2), {
		align: "end",
		get quick() {
			return U.motionDisabled;
		},
		get triggerRef() {
			return P(r);
		},
		get open() {
			return P(n);
		},
		set open(e) {
			k(n, e, !0);
		},
		children: (e, t) => {
			var n = tf(), r = j(n);
			{
				let e = (e) => {
					Pd(e, {});
				}, t = /* @__PURE__ */ D(() => !W.textToTranslate);
				Dd(r, {
					get disabled() {
						return P(t);
					},
					label: l.i18n.getMessage("popup_menu_reverse_translate"),
					onclick: u,
					size: "xs",
					leadingIcon: e,
					$$slots: { leadingIcon: !0 }
				});
			}
			var o = M(r, 2);
			{
				let e = (e) => {
					Id(e, {});
				}, t = (e) => {
					Rd(e, {});
				}, n = /* @__PURE__ */ D(() => !W.textToTranslate);
				Dd(o, {
					get disabled() {
						return P(n);
					},
					label: "Google Translate",
					onclick: d,
					size: "xs",
					leadingIcon: e,
					trailingIcon: t,
					$$slots: {
						leadingIcon: !0,
						trailingIcon: !0
					}
				});
			}
			var s = M(o, 4);
			{
				let e = (e) => {
					var t = Ji(), n = j(t), r = (e) => {
						Bd(e, {});
					}, i = (e) => {
						Hd(e, {});
					};
					L(n, (e) => {
						U.settings.lockWindow ? e(r) : e(i, -1);
					}), I(e, t);
				}, t = /* @__PURE__ */ D(() => U.settings.lockWindow ? l.i18n.getMessage("popup_menu_unlock_window") : l.i18n.getMessage("popup_menu_lock_window"));
				Dd(s, {
					keepOpen: !0,
					get label() {
						return P(t);
					},
					onclick: m,
					size: "xs",
					leadingIcon: e,
					$$slots: { leadingIcon: !0 }
				});
			}
			var g = M(s, 2);
			{
				let e = (e) => {
					var t = Ji(), n = j(t), r = (e) => {
						Wd(e, {});
					}, a = (e) => {
						Kd(e, {});
					};
					L(n, (e) => {
						P(i) ? e(r) : e(a, -1);
					}), I(e, t);
				}, t = /* @__PURE__ */ D(() => P(i) ? l.i18n.getMessage("popup_menu_show_translate_button") : l.i18n.getMessage("popup_menu_hide_translate_button"));
				Dd(g, {
					keepOpen: !0,
					get label() {
						return P(t);
					},
					onclick: f,
					size: "xs",
					leadingIcon: e,
					$$slots: { leadingIcon: !0 }
				});
			}
			var _ = M(g, 2);
			Dd(_, {
				label: l.i18n.getMessage("popup_menu_switch_to_simple_mode"),
				onclick: c,
				size: "xs",
				leadingIcon: (e) => {
					Jd(e, {});
				},
				$$slots: { leadingIcon: !0 }
			});
			var v = M(_, 2);
			{
				let e = (e) => {
					var t = Ji(), n = j(t), r = (e) => {
						Qd(e, {});
					}, i = (e) => {
						ef(e, {});
					};
					L(n, (e) => {
						P(a) ? e(r) : e(i, -1);
					}), I(e, t);
				}, t = /* @__PURE__ */ D(() => P(a) ? l.i18n.getMessage("options_general_layout_vert") : l.i18n.getMessage("options_general_layout_horiz"));
				Dd(v, {
					get label() {
						return P(t);
					},
					onclick: h,
					size: "xs",
					leadingIcon: e,
					$$slots: { leadingIcon: !0 }
				});
			}
			Dd(M(v, 4), {
				label: l.i18n.getMessage("popup_menu_options_all_settings"),
				onclick: p,
				size: "xs",
				leadingIcon: (e) => {
					Xd(e, {});
				},
				trailingIcon: (e) => {
					Rd(e, {});
				},
				$$slots: {
					leadingIcon: !0,
					trailingIcon: !0
				}
			}), I(e, n);
		},
		$$slots: { default: !0 }
	}), E(g), Ua(g, (e) => kd?.(e)), Ii("clickoutside", g, o), I(e, g), qt();
}
//#endregion
//#region ~icons/material-symbols/arrow-back-rounded.svelte
var af = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z\"></path></svg>");
function of(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = af();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/arrow-forward-rounded.svelte
var sf = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M16.175 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.175l-4.9-4.9q-.3-.3-.288-.7t.313-.7q.3-.275.7-.288t.7.288l6.6 6.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-6.6 6.6q-.275.275-.687.275T11.3 19.3q-.3-.3-.3-.712t.3-.713z\"></path></svg>");
function cf(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = sf();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/CacheNav.svelte
var lf = /* @__PURE__ */ F("<div class=\"flex items-center gap-1\"><!> <!></div>");
function uf(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ D(() => W.cacheIndex <= -W.cacheKeys.length), r = /* @__PURE__ */ D(() => W.cacheIndex >= -1);
	function i() {
		P(n) || W.setCacheItem(W.cacheIndex - 1);
	}
	function a() {
		P(r) || W.setCacheItem(W.cacheIndex + 1);
	}
	var o = lf(), s = A(o);
	ed(s, {
		color: "standard",
		get disabled() {
			return P(n);
		},
		onclick: i,
		size: "xs",
		title: l.i18n.getMessage("tooltip_go_back"),
		children: (e, t) => {
			of(e, {});
		},
		$$slots: { default: !0 }
	}), ed(M(s, 2), {
		color: "standard",
		get disabled() {
			return P(r);
		},
		onclick: a,
		size: "xs",
		title: l.i18n.getMessage("tooltip_go_forward"),
		children: (e, t) => {
			cf(e, {});
		},
		$$slots: { default: !0 }
	}), E(o), I(e, o), qt();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/internal/flags/legacy.js
It();
//#endregion
//#region src/lib/base/Listbox/context.ts
var [df, ff] = Ht(), pf = (e, t) => {
	jr(() => {
		let n = (n) => {
			let r = n.button === 0;
			if (!n.target || !r) return;
			let i = n.composedPath(), a = n.target, o = i.includes(e) || e.contains(a), s = t?.exclude && (i.includes(t.exclude) || t.exclude.contains(a));
			!o && !s && e.dispatchEvent(new CustomEvent("clickoutside"));
		};
		return document.addEventListener("mousedown", n, !0), () => {
			document.removeEventListener("mousedown", n, !0);
		};
	});
}, mf = /* @__PURE__ */ F("<div><ul id=\"animate-child\" role=\"listbox\" tabindex=\"-1\"><!></ul></div>"), hf = /* @__PURE__ */ F("<span class=\"relative\"><!> <!></span>");
function gf(e, t) {
	Kt(t, !0);
	let n = H(t, "value", 15), r = H(t, "open", 15, !1), i = H(t, "triggerRef", 7, null), a = H(t, "color", 3, "standard"), o = H(t, "align", 3, "start"), s = H(t, "quick", 3, !1), c = /* @__PURE__ */ O(null), l = /* @__PURE__ */ D(() => xd[o()]), u = /* @__PURE__ */ D(() => s() ? 0 : 350), d = /* @__PURE__ */ D(() => s() ? 0 : 250);
	function f() {
		r(!0), v();
	}
	function p() {
		r() ? m() : f();
	}
	async function m() {
		r(!1), await Ti(), i()?.focus();
	}
	ff({
		get value() {
			return n();
		},
		set value(e) {
			n() !== e && (n(e), t.onchange?.(e));
		},
		get open() {
			return r();
		},
		get color() {
			return a();
		},
		get triggerRef() {
			return i();
		},
		set triggerRef(e) {
			i(e);
		},
		toggle: p,
		openListbox: f,
		close: m
	});
	function h(e) {
		let t = _d(P(c), "option");
		switch (e.code) {
			case fd.ArrowDown:
				e.preventDefault(), gd(t, pd.Next);
				break;
			case fd.ArrowUp:
				e.preventDefault(), gd(t, pd.Prev);
				break;
			case fd.Home:
				e.preventDefault(), gd(t, pd.First);
				break;
			case fd.End:
				e.preventDefault(), gd(t, pd.Last);
				break;
			case fd.Tab:
				r(!1);
				break;
			case fd.Escape:
				m();
				break;
		}
	}
	function g(e) {
		switch (e.code) {
			case fd.ArrowDown:
			case fd.ArrowUp:
				e.preventDefault(), f();
				break;
		}
	}
	function _() {
		return _d(P(c), "option").find((e) => e.ariaSelected === "true");
	}
	async function v() {
		await Ti(), _()?.focus({ preventScroll: !0 });
	}
	function y() {
		_()?.scrollIntoView({
			block: "nearest",
			...s() ? {} : { behavior: "smooth" }
		});
	}
	var b = hf(), x = A(b), ee = (e) => {
		var i = Ji();
		da(j(i), () => t.listboxButton, () => ({
			toggle: p,
			open: r(),
			value: n(),
			triggerKeydown: g
		})), I(e, i);
	};
	L(x, (e) => {
		t.listboxButton && e(ee);
	});
	var S = M(x, 2), C = (e) => {
		var n = mf(), r = A(n);
		z(r, 1, R(["flex flex-1 flex-col justify-between gap-0.5 p-1 select-none", "scrollbar overflow-x-clip focus:outline-none"])), da(A(r), () => t.children), E(r), Co(r, (e) => k(c, e), () => P(c)), E(n), N(() => z(n, 1, R([
			"absolute top-full z-20 flex max-h-80 flex-col overflow-hidden rounded-2xl shadow-sm",
			a() === "standard" ? "bg-color-surface-container-low" : "bg-color-tertiary-container",
			P(l)
		]))), Li("keydown", r, h), Va(1, n, () => vd, () => ({
			duration: P(u),
			animateChildSelector: "#animate-child",
			onEnd: y
		})), Va(2, n, () => vd, () => ({
			duration: P(d),
			animateChildSelector: "#animate-child"
		})), I(e, n);
	};
	L(S, (e) => {
		r() && e(C);
	}), E(b), Ua(b, (e) => pf?.(e)), Ii("clickoutside", b, () => r(!1)), I(e, b), qt();
}
Ri(["keydown"]);
//#endregion
//#region ~icons/material-symbols/arrow-drop-down-rounded.svelte
var _f = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M11.475 14.475L7.85 10.85q-.075-.075-.112-.162T7.7 10.5q0-.2.138-.35T8.2 10h7.6q.225 0 .363.15t.137.35q0 .05-.15.35l-3.625 3.625q-.125.125-.25.175T12 14.7t-.275-.05t-.25-.175\"></path></svg>");
function vf(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = _f();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/lib/base/Listbox/ListboxButton.svelte
var yf = /* @__PURE__ */ F("<span><!></span>"), bf = /* @__PURE__ */ F("<span><!></span>"), xf = /* @__PURE__ */ F("<span><!></span>"), Sf = /* @__PURE__ */ F("<button><span></span> <div><!> <span><!></span> <!></div></button>");
function Cf(e, t) {
	Kt(t, !0);
	let n = Qu({
		slots: {
			base: [
				"group relative flex min-w-40 shrink-0 cursor-pointer items-center rounded-sm bg-transparent px-3",
				"outline-none aria-disabled:pointer-events-none aria-disabled:opacity-disabled",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0"
			],
			outline: [
				"pointer-events-none absolute inset-0 rounded-[inherit]",
				"before:absolute before:inset-0 before:rounded-[inherit] before:border",
				"before:transition-[border-color] before:ease-effects-fast",
				"after:absolute after:inset-0 after:rounded-[inherit] after:border-3 after:opacity-0",
				"after:transition-opacity after:ease-effects-fast",
				"after:border-color-primary group-focus-visible:after:opacity-100 group-active:after:opacity-100 group-aria-expanded:after:opacity-100"
			],
			content: "relative flex w-full items-center gap-4",
			iconClass: "text-color-on-surface-variant [&:not(:has(svg))]:hidden",
			labelClass: "flex-1 truncate text-start text-color-on-surface"
		},
		variants: {
			size: {
				xs: {
					base: "h-8",
					iconClass: "[&_svg]:size-5",
					labelClass: "text-sm"
				},
				sm: {
					base: "h-10",
					iconClass: "[&_svg]:size-6",
					labelClass: "text-base"
				}
			},
			lowAccent: {
				true: {
					outline: "before:border-color-outline-variant group-hover:before:border-color-outline",
					labelClass: ["text-color-on-surface-variant group-hover:text-color-on-surface group-aria-expanded:text-color-on-surface", "transition-colors ease-effects-fast"]
				},
				false: {
					outline: "before:border-color-outline group-hover:before:border-color-on-surface",
					labelClass: "text-color-on-surface"
				}
			}
		},
		defaultVariants: { size: "sm" }
	}), r = H(t, "ref", 15, null), i = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy",
		"children",
		"ref",
		"leadingIcon",
		"trailingIcon",
		"size",
		"class",
		"lowAccent"
	]), a = df(), { base: o, outline: s, content: c, iconClass: l, labelClass: u } = n();
	function d(e) {
		switch (e.code) {
			case fd.ArrowDown:
			case fd.ArrowUp:
				e.preventDefault(), e.stopPropagation(), a.openListbox();
				break;
		}
	}
	fa(() => {
		a.triggerRef = r();
	});
	var f = Sf();
	B(f, (e) => ({
		class: e,
		"aria-expanded": a.open,
		"aria-haspopup": "listbox",
		onclick: a.toggle,
		onkeydown: d,
		type: "button",
		...i
	}), [() => o({
		size: t.size,
		class: t.class
	})]);
	var p = A(f), m = M(p, 2), h = A(m), g = (e) => {
		var n = yf();
		da(A(n), () => t.leadingIcon, () => a.open), E(n), N((e) => z(n, 1, e), [() => R(l({ size: t.size }))]), I(e, n);
	};
	L(h, (e) => {
		t.leadingIcon && e(g);
	});
	var _ = M(h, 2);
	da(A(_), () => t.children), E(_);
	var v = M(_, 2), y = (e) => {
		var n = bf();
		da(A(n), () => t.trailingIcon, () => a.open), E(n), N((e) => z(n, 1, e), [() => R(l({ size: t.size }))]), I(e, n);
	}, b = (e) => {
		var n = xf(), r = A(n);
		{
			let e = /* @__PURE__ */ D(() => ["transition-transform ease-effects-fast", a.open && "-scale-y-100"]);
			vf(r, { get class() {
				return P(e);
			} });
		}
		E(n), N((e) => z(n, 1, e), [() => R(l({ size: t.size }))]), I(e, n);
	};
	L(v, (e) => {
		t.trailingIcon ? e(y) : e(b, -1);
	}), E(m), E(f), Co(f, (e) => r(e), () => r()), N((e, t, n) => {
		z(p, 1, e), z(m, 1, t), z(_, 1, n);
	}, [
		() => R(s({ lowAccent: t.lowAccent })),
		() => R(c()),
		() => R(u({
			size: t.size,
			lowAccent: t.lowAccent
		}))
	]), I(e, f), qt();
}
//#endregion
//#region src/lib/base/Listbox/ListboxOption.svelte
var wf = /* @__PURE__ */ F("<span aria-hidden=\"true\"><!></span>"), Tf = /* @__PURE__ */ F("<span aria-hidden=\"true\"><!></span>"), Ef = /* @__PURE__ */ F("<li role=\"option\" tabindex=\"-1\"><span></span> <div><!> <span> </span> <!></div></li>");
function Df(e, t) {
	Kt(t, !0);
	let n = Qu({
		slots: {
			base: [
				"group relative flex min-w-40 shrink-0 cursor-pointer px-3",
				"rounded-sm first:rounded-t-xl last:rounded-b-xl",
				"outline-color-secondary focus-visible:outline-menu",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				"aria-disabled:pointer-events-none aria-disabled:opacity-disabled",
				"aria-selected:rounded-xl"
			],
			stateLayer: ["pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity ease-effects-fast", "group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed"],
			content: "relative flex w-full items-center gap-2",
			iconClass: "[&_svg]:size-5 [&:not(:has(svg))]:hidden",
			labelClass: "flex-1 text-sm font-medium whitespace-nowrap"
		},
		variants: {
			color: {
				standard: {
					base: "aria-selected:bg-color-tertiary-container",
					iconClass: "text-color-on-surface-variant group-aria-selected:text-color-on-tertiary-container",
					labelClass: "text-color-on-surface group-aria-selected:text-color-on-tertiary-container",
					stateLayer: "bg-color-on-surface group-aria-selected:bg-color-on-tertiary-container"
				},
				vibrant: {
					base: "aria-selected:bg-color-tertiary",
					iconClass: "text-color-on-tertiary-container group-aria-selected:text-color-on-tertiary",
					labelClass: "text-color-on-tertiary-container group-aria-selected:text-color-on-tertiary",
					stateLayer: "bg-color-on-tertiary-container group-aria-selected:bg-color-on-tertiary"
				}
			},
			size: {
				xs: "h-8",
				sm: "h-10"
			}
		},
		defaultVariants: {
			color: "standard",
			size: "sm"
		}
	}), r = df(), i = H(t, "color", 19, () => r.color), a = /* @__PURE__ */ D(() => t.value === r.value), { base: o, stateLayer: s, content: c, iconClass: l, labelClass: u } = n();
	function d() {
		r.value = t.value, t.keepOpen || r.close();
	}
	function f(e) {
		(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), d());
	}
	var p = Ef(), m = A(p), h = M(m, 2), g = A(h), _ = (e) => {
		var n = wf();
		da(A(n), () => t.leadingIcon, () => P(a)), E(n), N((e) => z(n, 1, e), [() => R(l({ color: i() }))]), I(e, n);
	};
	L(g, (e) => {
		t.leadingIcon && e(_);
	});
	var v = M(g, 2), y = A(v, !0);
	E(v);
	var b = M(v, 2), x = (e) => {
		var n = Tf();
		da(A(n), () => t.trailingIcon, () => P(a)), E(n), N((e) => z(n, 1, e), [() => R(l({ color: i() }))]), I(e, n);
	};
	L(b, (e) => {
		t.trailingIcon && e(x);
	}), E(h), E(p), N((e, n, r, i) => {
		z(p, 1, e), mo(p, "aria-disabled", t.disabled || void 0), mo(p, "aria-selected", P(a)), z(m, 1, n), z(h, 1, r), z(v, 1, i), ia(y, t.label);
	}, [
		() => R(o({
			size: t.size,
			color: i()
		})),
		() => R(s({ color: i() })),
		() => R(c()),
		() => R(u({ color: i() }))
	]), Li("click", p, d), Li("keydown", p, f), I(e, p), qt();
}
Ri(["click", "keydown"]);
//#endregion
//#region ~icons/material-symbols/check-rounded.svelte
var Of = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z\"></path></svg>");
function kf(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Of();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/SelectModel.svelte
var Af = Eo(() => U);
function jf(e, t) {
	Kt(t, !1);
	function n() {
		is.isSelectedProviderGoogle || W.translate();
	}
	wo(), gf(e, {
		onchange: n,
		get quick() {
			return Af().motionDisabled;
		},
		get value() {
			return Af().settings.modelId;
		},
		set value(e) {
			Af(Af().settings.modelId = e);
		},
		listboxButton: (e) => {
			Cf(e, {
				class: "max-w-52",
				lowAccent: !0,
				size: "xs",
				get title() {
					return `${is.selectedProvider.name ?? ""}/${is.selectedModel.model ?? ""}`;
				},
				children: (e, t) => {
					Ot();
					var n = qi();
					N(() => ia(n, is.selectedModel.model)), I(e, n);
				},
				$$slots: { default: !0 }
			});
		},
		children: (e, t) => {
			var n = Ji();
			Ca(j(n), 1, () => is.providers, (e) => e.id, (e, t) => {
				let n = /* @__PURE__ */ Un(() => P(t).id === Lo.TranslatorApi && !is.isTranslationAPIAvailable);
				var r = Ji();
				Ca(j(r), 1, () => P(t).models, (e) => e.id, (e, r) => {
					{
						let i = (e, t = Pe) => {
							var n = Ji(), r = j(n), i = (e) => {
								kf(e, {});
							};
							L(r, (e) => {
								t() && e(i);
							}), I(e, n);
						}, a = /* @__PURE__ */ Un(() => !P(r).model || P(n));
						Df(e, {
							get disabled() {
								return P(a);
							},
							get label() {
								return `${P(t).name ?? ""}/${P(r).model ?? ""}`;
							},
							size: "xs",
							get value() {
								return P(r).id;
							},
							leadingIcon: i,
							$$slots: { leadingIcon: !0 }
						});
					}
				}), I(e, r);
			}), I(e, n);
		},
		$$slots: {
			listboxButton: !0,
			default: !0
		},
		$$legacy: !0
	}), qt();
}
//#endregion
//#region src/entrypoints/content/utils/fontSizeToClass.ts
var Mf = {
	12: "text-xs",
	14: "text-sm",
	16: "text-base",
	18: "text-lg",
	20: "text-xl"
};
function Nf(e) {
	return Mf[e] || "text-base";
}
//#endregion
//#region ~icons/material-symbols/close-rounded.svelte
var Pf = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z\"></path></svg>");
function Ff(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Pf();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/TextareaOrig.svelte
var If = /* @__PURE__ */ F("<span class=\"absolute top-1 right-1 z-20\"><!></span>"), Lf = /* @__PURE__ */ F("<label><div></div> <textarea rows=\"1\" spellcheck=\"false\"></textarea> <span></span> <!></label>");
function Rf(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ D(() => W.translated?.sentence.orig || W.textToTranslate), r = /* @__PURE__ */ O(void 0), i = /* @__PURE__ */ O(void 0), a = /* @__PURE__ */ D(() => Nf(U.settings.fontSize)), o = /* @__PURE__ */ D(() => U.settings.popupLayout === Po.Horiz), s = /* @__PURE__ */ D(() => P(o) ? Infinity : 300), c = /* @__PURE__ */ D(() => {
		let e = Rt(P(n));
		if (W.textToHighlight) {
			let t = RegExp.escape(W.textToHighlight.trim()), n = new RegExp(t, "g");
			return e.replace(n, "<span class=\"bg-color-secondary-container\">$&</span>");
		}
		return e;
	}), u = (e) => {
		P(n) !== void 0 && (e.style.height = "auto", e.style.height = Math.min(e.scrollHeight, P(s)) + "px");
	};
	function d(e) {
		let t = e.target;
		P(r) && (P(r).scrollTop = t.scrollTop);
	}
	function f(e) {
		clearTimeout(P(i)), k(i, window.setTimeout(() => {
			W.textToTranslate !== e && (W.textToTranslate = e, W.translate());
		}, 1e3), !0);
	}
	function p(e) {
		f(e.target.value.trim());
	}
	let m = (e) => {
		P(n) || e.focus();
	};
	function h() {
		k(n, ""), W.resetTranslateStore();
	}
	var g = Lf(), _ = A(g);
	ka(_, () => P(c), !0), E(_), Co(_, (e) => k(r, e), () => P(r));
	var v = M(_, 2);
	xr(v), Wa(v, () => u), Wa(v, () => m);
	var y = M(v, 2);
	z(y, 1, R([
		"pointer-events-none absolute inset-0 rounded-sm",
		"before:absolute before:inset-0 before:rounded-[inherit] before:border",
		"before:transition-[border-color] before:ease-effects-fast",
		"before:border-color-outline-variant group-has-hover/textarea:before:border-color-outline",
		"after:absolute after:inset-0 after:rounded-[inherit] after:border-3 after:opacity-0",
		"after:transition-opacity after:ease-effects-fast",
		"after:border-color-primary group-has-focus/textarea:after:opacity-100 group-has-active/textarea:after:opacity-100"
	]));
	var b = M(y, 2), x = (e) => {
		var t = If();
		ed(A(t), {
			color: "standard",
			onclick: h,
			size: "xs",
			title: l.i18n.getMessage("tooltip_clear_text"),
			children: (e, t) => {
				Ff(e, {});
			},
			$$slots: { default: !0 }
		}), E(t), Va(3, t, () => ls, () => ({ duration: 150 })), I(e, t);
	};
	L(b, (e) => {
		P(n) && e(x);
	}), E(g), N(() => {
		z(g, 1, R(["group/textarea relative z-0 flex min-h-0 flex-col overflow-hidden", P(o) && "h-full"])), z(_, 1, R([
			"absolute inset-0 -z-10 scrollbar-transparent overflow-y-auto py-2 pr-9 pl-1.5",
			"whitespace-pre-line text-transparent",
			P(a)
		])), z(v, 1, R([
			"z-10 scrollbar size-full min-h-10 resize-none rounded-sm py-2 pr-9 pl-1.5 whitespace-pre-line",
			"border-none bg-transparent text-color-on-surface caret-color-primary outline-none focus:outline-none",
			P(a)
		]));
	}), Li("input", v, p), Ii("scroll", v, d), yo(v, () => P(n), (e) => k(n, e)), I(e, g), qt();
}
Ri(["input"]);
//#endregion
//#region ~icons/material-symbols/progress-activity.svelte
var zf = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M8.125 21.213q-1.825-.788-3.187-2.15t-2.15-3.188T2 11.988t.788-3.875t2.15-3.175t3.187-2.15T12 2q.425 0 .713.288T13 3t-.288.713T12 4Q8.675 4 6.337 6.338T4 12t2.338 5.663T12 20t5.663-2.337T20 12q0-.425.288-.712T21 11t.713.288T22 12q0 2.05-.788 3.875t-2.15 3.188t-3.175 2.15t-3.875.787t-3.887-.787\"></path></svg>");
function Bf(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = zf();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/lib/Loader.svelte
function Vf(e, t) {
	{
		let n = /* @__PURE__ */ D(() => ["shrink-0 animate-spin text-color-primary", t.class]);
		Bf(e, { get class() {
			return P(n);
		} });
	}
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/TranslationGoogle/lib/TranslatedText/lib/Alternatives.svelte
var Hf = /* @__PURE__ */ F("<button type=\"button\"><!> <span class=\"text-start\"> </span></button>"), Uf = /* @__PURE__ */ F("<div></div>");
function Wf(e, t) {
	Kt(t, !0);
	let n = H(t, "text", 15), r = H(t, "altsOpen", 15), i = H(t, "portal", 15), a = /* @__PURE__ */ D(() => U.motionDisabled ? 0 : 350);
	function o(e) {
		n(e), r(!1);
	}
	let s = (e) => {
		let n = document.querySelector(me).shadowRoot.querySelector(`.${he}`);
		n && (e.style.top = `${t.rect.bottom}px`, e.style.left = `${t.rect.left}px`, n.append(e)), jr(() => () => {
			e.remove();
		});
	};
	var c = Uf();
	z(c, 1, R(["fixed z-9999999991 scrollbar flex max-h-96 flex-col gap-0.5 overflow-y-auto rounded-2xl p-1 text-sm", "bg-color-surface-container-low shadow-sm"])), Ca(c, 21, () => t.alternatives, ya, (e, t) => {
		var r = Hf(), i = A(r), a = (e) => {
			kf(e, { class: "inline-flex size-5 shrink-0" });
		};
		L(i, (e) => {
			n() === P(t) && e(a);
		});
		var s = M(i, 2), c = A(s, !0);
		E(s), E(r), N(() => {
			z(r, 1, R([
				"flex max-w-xl min-w-32 cursor-pointer items-center gap-2 px-3 py-1.5 font-medium transition-colors",
				"first:rounded-t-xl last:rounded-b-xl",
				n() === P(t) ? "rounded-xl bg-color-tertiary-container text-color-on-tertiary-container hover:bg-color-tertiary-container/92" : "rounded-sm text-color-on-surface hover:bg-color-on-surface/8"
			])), ia(c, P(t));
		}), Li("click", r, () => o(P(t))), I(e, r);
	}), E(c), Co(c, (e) => i(e), () => i()), Ua(c, (e) => s?.(e)), Va(3, c, () => us, () => ({
		duration: P(a),
		y: -10,
		easing: ud
	})), I(e, c), qt();
}
Ri(["click"]);
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/TranslationGoogle/lib/TranslatedText/lib/Segment.svelte
var Gf = /* @__PURE__ */ F("<span role=\"button\" tabindex=\"0\"> </span> <!>", 1), Kf = /* @__PURE__ */ F("<span> </span>");
function qf(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ D(() => t.segment.text), r = /* @__PURE__ */ O(!1), i = /* @__PURE__ */ O(ir(new DOMRect())), a = ir({ exclude: void 0 });
	function o(e) {
		if (!P(r)) {
			let t = e.currentTarget;
			k(i, t.getBoundingClientRect(), !0);
		}
		k(r, !P(r));
	}
	function s() {
		k(r, !1);
	}
	function c() {
		W.textToHighlight = t.segment.rawSegment;
	}
	function l() {
		W.textToHighlight = "";
	}
	function u(e) {
		(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), o(e));
	}
	var d = Ji(), f = j(d), p = (e) => {
		var d = Gf(), f = j(d), p = A(f, !0);
		E(f), Ua(f, (e, t) => kd?.(e, t), () => a);
		var m = M(f, 2), h = (e) => {
			Wf(e, {
				get alternatives() {
					return t.segment.alternatives;
				},
				get rect() {
					return P(i);
				},
				get altsOpen() {
					return P(r);
				},
				set altsOpen(e) {
					k(r, e, !0);
				},
				get text() {
					return P(n);
				},
				set text(e) {
					k(n, e);
				},
				get portal() {
					return a.exclude;
				},
				set portal(e) {
					a.exclude = e;
				}
			});
		};
		L(m, (e) => {
			P(r) && e(h);
		}), N(() => {
			z(f, 1, R([
				"cursor-pointer rounded-xs text-color-on-surface hover:bg-color-secondary-container hover:text-color-on-secondary-container",
				"transition-colors ease-effects-fast",
				"outline-color-secondary focus-visible:outline-common",
				P(r) && "bg-color-secondary-container text-color-on-secondary-container"
			])), ia(p, P(n));
		}), Li("click", f, o), Ii("clickoutside", f, s), Li("keydown", f, u), Ii("mouseenter", f, c), Ii("mouseleave", f, l), I(e, d);
	}, m = (e) => {
		var n = Kf(), r = A(n, !0);
		E(n), N(() => ia(r, t.segment.text)), I(e, n);
	};
	L(f, (e) => {
		t.segment.alternatives.length ? e(p) : e(m, -1);
	}), I(e, d), qt();
}
Ri(["click", "keydown"]);
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/TranslationGoogle/lib/TranslatedText/TranslatedText.svelte
var Jf = /* @__PURE__ */ F("<p> </p>");
function Yf(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ D(() => {
		let e = t.translated.alternative_translations;
		return e?.length ? e.map((e) => {
			if (e.src_phrase.startsWith("\n") || e.raw_src_segment.startsWith("\n")) return {
				text: e.raw_src_segment,
				alternatives: [],
				rawSegment: ""
			};
			let t = e?.alternative && e.alternative[0] ? e.alternative[0].word_postproc : "", n = (e.alternative || []).map((e) => e.word_postproc);
			return {
				text: t,
				alternatives: [...new Set(n)],
				rawSegment: e.raw_src_segment
			};
		}) : [];
	});
	var r = Ji(), i = j(r), a = (e) => {
		var t = Ji();
		Ca(j(t), 17, () => P(n), ya, (e, t) => {
			qf(e, { get segment() {
				return P(t);
			} });
		}), I(e, t);
	}, o = (e) => {
		var n = Jf(), r = A(n, !0);
		E(n), N(() => ia(r, t.translated.sentence.trans)), I(e, n);
	};
	L(i, (e) => {
		P(n).length ? e(a) : e(o, -1);
	}), I(e, r), qt();
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/TranslationGoogle/TranslationGoogle.svelte
var Xf = /* @__PURE__ */ F("<p class=\"text-sm text-color-on-surface-variant\"> </p>"), Zf = /* @__PURE__ */ F("<div><!></div> <!>", 1), Qf = /* @__PURE__ */ F("<p class=\"text-sm text-color-error\"> </p>"), $f = /* @__PURE__ */ F("<div class=\"flex w-full justify-center py-2\"><!></div>"), ep = /* @__PURE__ */ F("<p class=\"text-sm text-color-on-surface-variant\"></p>");
function tp(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ D(() => Nf(U.settings.fontSize));
	var r = Ji(), i = j(r), a = (e) => {
		var t = Zf(), r = j(t);
		Yf(A(r), { get translated() {
			return W.translated;
		} }), E(r);
		var i = M(r, 2), a = (e) => {
			var t = Xf(), n = A(t, !0);
			E(t), N(() => ia(n, W.translated.sentence.translit)), I(e, t);
		};
		L(i, (e) => {
			U.settings.showTransliteration && e(a);
		}), N(() => z(r, 1, R(P(n)))), I(e, t);
	}, o = (e) => {
		var t = Qf(), n = A(t, !0);
		E(t), N((e) => ia(n, e), [() => W.errors.google.join("\n")]), I(e, t);
	}, s = (e) => {
		var t = $f();
		Vf(A(t), { class: "size-6" }), E(t), I(e, t);
	}, c = (e) => {
		var t = ep();
		t.textContent = l.i18n.getMessage("popup_placeholder_translation"), I(e, t);
	};
	L(i, (e) => {
		W.translated ? e(a) : W.errors.google.length ? e(o, 1) : W.isPending ? e(s, 2) : e(c, -1);
	}), I(e, r), qt();
}
//#endregion
//#region ~icons/material-symbols/stop-rounded.svelte
var np = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M6 16V8q0-.825.588-1.412T8 6h8q.825 0 1.413.588T18 8v8q0 .825-.587 1.413T16 18H8q-.825 0-1.412-.587T6 16\"></path></svg>");
function rp(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = np();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/refresh-rounded.svelte
var ip = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V5q0-.425.288-.712T19 4t.713.288T20 5v5q0 .425-.288.713T19 11h-5q-.425 0-.712-.288T13 10t.288-.712T14 9h3.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.7 0 3.113-.862t2.187-2.313q.2-.35.563-.487t.737-.013q.4.125.575.525t-.025.75q-1.025 2-2.925 3.2T12 20\"></path></svg>");
function ap(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = ip();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/TranslationAi.svelte
var op = /* @__PURE__ */ F("<p class=\"text-sm text-color-on-surface-variant\"> </p>"), sp = /* @__PURE__ */ F("<!> <!>", 1), cp = /* @__PURE__ */ F("<div class=\"flex w-full justify-between\"><div class=\"flex flex-col\"><!> <div> </div></div> <div class=\"relative -mt-1 flex size-fit shrink-0 items-center justify-center overflow-hidden\"><!></div></div>"), lp = /* @__PURE__ */ F("<p class=\"text-sm text-color-on-surface-variant\"></p>"), up = /* @__PURE__ */ F("<p class=\"text-sm text-color-error\"> </p>"), dp = /* @__PURE__ */ F("<!> <!>", 1);
function fp(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ D(() => Nf(U.settings.fontSize));
	var r = dp(), i = j(r), a = (e) => {
		var t = cp(), r = A(t), i = A(r), a = (e) => {
			var t = op(), n = A(t);
			E(t), N(() => ia(n, `Downloading model: ${W.downloadProgress ?? ""}%`)), I(e, t);
		};
		L(i, (e) => {
			W.downloadProgress !== null && e(a);
		});
		var o = M(i, 2), s = A(o, !0);
		E(o), E(r);
		var c = M(r, 2), l = A(c), u = (e) => {
			var t = sp(), n = j(t);
			Vf(n, { class: "absolute size-8" }), ed(M(n, 2), {
				color: "standard",
				get onclick() {
					return W.stopTranslation;
				},
				size: "xs",
				title: "Stop translation",
				children: (e, t) => {
					rp(e, {});
				},
				$$slots: { default: !0 }
			}), I(e, t);
		}, d = (e) => {
			ed(e, {
				color: "standard",
				get onclick() {
					return W.reTranslateIgnoreCache;
				},
				size: "xs",
				title: "Retry translation",
				children: (e, t) => {
					ap(e, {});
				},
				$$slots: { default: !0 }
			});
		};
		L(l, (e) => {
			W.translationAi.isStreaming ? e(u) : e(d, -1);
		}), E(c), E(t), N(() => {
			z(o, 1, R(["text-color-on-surface", P(n)])), ia(s, W.translationAi.text);
		}), I(e, t);
	}, o = (e) => {
		var t = lp();
		t.textContent = l.i18n.getMessage("popup_placeholder_translation"), I(e, t);
	};
	L(i, (e) => {
		W.translationAi ? e(a) : e(o, -1);
	});
	var s = M(i, 2), c = (e) => {
		var t = up(), n = A(t, !0);
		E(t), N((e) => ia(n, e), [() => W.errors.ai.join("\n")]), I(e, t);
	};
	L(s, (e) => {
		W.errors.ai.length && e(c);
	}), I(e, r), qt();
}
//#endregion
//#region ~icons/material-symbols/content-copy-outline-rounded.svelte
var pp = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V7q0-.425.288-.712T4 6t.713.288T5 7v13h10q.425 0 .713.288T16 21t-.288.713T15 22zm4-6V4z\"></path></svg>");
function mp(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = pp();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/check-circle-outline-rounded.svelte
var hp = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8\"></path></svg>");
function gp(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = hp();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/error-outline-rounded.svelte
var _p = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M12.713 16.713Q13 16.425 13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17t.713-.288m0-4Q13 12.425 13 12V8q0-.425-.288-.712T12 7t-.712.288T11 8v4q0 .425.288.713T12 13t.713-.288M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8\"></path></svg>");
function vp(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = _p();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/ButtonCopy.svelte
function yp(e, t) {
	let n = /* @__PURE__ */ O(!1), r = /* @__PURE__ */ O(!1), i = !!navigator.clipboard, a = /* @__PURE__ */ D(() => i ? l.i18n.getMessage("tooltip_copy_to_clipboard") : l.i18n.getMessage("tooltip_copy_not_support_on_http")), o = /* @__PURE__ */ D(() => P(n) ? gp : P(r) ? vp : mp);
	function s() {
		setTimeout(() => {
			k(n, !1), k(r, !1);
		}, 1e3);
	}
	async function c() {
		try {
			await navigator.clipboard.writeText(t.text), k(n, !0);
		} catch (e) {
			k(r, !0), console.log(`Error: ${e}`);
		} finally {
			s();
		}
	}
	{
		let s = /* @__PURE__ */ D(() => !i || !t.text);
		ed(e, {
			color: "standard",
			get disabled() {
				return P(s);
			},
			onclick: c,
			size: "xs",
			get title() {
				return P(a);
			},
			children: (e, t) => {
				var i = Ji(), a = j(i);
				{
					let e = /* @__PURE__ */ D(() => P(n) ? "text-green-500" : P(r) ? "text-color-error" : "");
					Aa(a, () => P(o), (t, n) => {
						n(t, { get class() {
							return P(e);
						} });
					});
				}
				I(e, i);
			},
			$$slots: { default: !0 }
		});
	}
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/TTS/utils/BrowserTTS.svelte.ts
var bp = class {
	#e = window.speechSynthesis;
	#t = null;
	#n = /* @__PURE__ */ O(ir({
		waiting: !1,
		speaking: !1,
		error: !1
	}));
	get status() {
		return P(this.#n);
	}
	set status(e) {
		k(this.#n, e, !0);
	}
	#r() {
		W.audioContextSource && W.audioContextSource.stop(), this.#e.speaking && this.stop();
	}
	speak({ text: e = "sample text-to-speech text", voice: t = null }) {
		this.status.waiting = !0, this.#r(), this.#t = new SpeechSynthesisUtterance(e), this.#t.voice = t, this.#t.onstart = () => {
			this.status.waiting = !1, this.status.speaking = !0;
		}, this.#t.onend = () => {
			this.status.speaking = !1;
		}, this.#t.onerror = ({ error: e }) => {
			["canceled", "interrupted"].includes(e) || console.error(`An error has occurred with the speech synthesis: ${e}`), this.status.waiting = !1, this.status.speaking = !1;
		}, this.#e.speak(this.#t);
	}
	stop() {
		this.#e.cancel();
	}
}, xp = class {
	#e = null;
	#t = /* @__PURE__ */ O(ir({
		waiting: !1,
		speaking: !1,
		error: !1
	}));
	get status() {
		return P(this.#t);
	}
	set status(e) {
		k(this.#t, e, !0);
	}
	async #n({ targetLang: e, text: t }) {
		try {
			return await l.runtime.sendMessage({
				type: "getTranslateTTS",
				content: {
					targetLang: e,
					text: t
				}
			});
		} catch (e) {
			console.error("Error occurred while fetching TTS: ", e);
		}
	}
	async #r(e) {
		this.status.waiting = !1, this.status.speaking = !0;
		let t = new Uint8Array(e).buffer, n = new AudioContext(), r = await n.decodeAudioData(t);
		this.#e = n.createBufferSource(), this.#e.buffer = r, this.#e.connect(n.destination), this.#e.start(), this.#e.onended = () => {
			this.status.speaking = !1;
		}, W.audioContextSource = this.#e;
	}
	#i() {
		window?.speechSynthesis?.speaking && window.speechSynthesis.cancel(), W.audioContextSource && W.audioContextSource.stop();
	}
	async speak({ text: e = "", targetLang: t = "en" }) {
		this.status.waiting = !0, this.#i();
		let n = W.cacheTTS.find((n) => n.targetLang === t && n.text === e);
		if (n) {
			this.#r(n.data);
			return;
		}
		let r = await this.#n({
			targetLang: t,
			text: e
		});
		r && r.status && r.data ? (this.#r(r.data), W.cacheTTS.push({
			targetLang: t,
			text: e,
			data: r.data
		})) : (this.status.waiting = !1, this.status.error = !0);
	}
	stop() {
		this.#e && this.#e.stop();
	}
}, Sp = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M18.425 22.3q-.425 0-.712-.288t-.288-.712q0-.2.075-.4t.2-.325q1.075-1.075 1.688-2.475T20 15.05q0-1.625-.612-3.037T17.7 9.525q-.125-.125-.2-.325t-.075-.4q0-.425.288-.712t.712-.288q.2 0 .388.088t.312.212q1.35 1.35 2.113 3.138T22 15.05q0 2.05-.763 3.825T19.126 22q-.125.125-.312.213t-.388.087m-2.85-2.85q-.425 0-.712-.287t-.288-.713q0-.2.088-.387t.212-.313q.525-.525.825-1.213t.3-1.487t-.312-1.487t-.813-1.213q-.15-.125-.225-.312t-.075-.388q0-.425.288-.712t.712-.288q.2 0 .4.075t.325.225q.8.8 1.25 1.85t.45 2.25t-.45 2.25t-1.25 1.85q-.125.15-.325.225t-.4.075M8 15H6v.275q0 .875.538 1.538T7.9 17.7l.3.075q1 .25 1.125 1.25t-.775 1.5q-1.275.725-2.675 1.05t-2.875.4q-.425.025-.712-.263T2 21t.288-.712t.712-.313q.9-.05 1.763-.213t1.712-.462q-1.15-.575-1.812-1.662T4 15.275V14q0-.425.288-.712T5 13h3v-2q0-.425.288-.712T9 10h2.375L8.55 4.35q-.2-.375-.062-.762T9 3t.763-.062t.587.512l2.825 5.65q.5 1-.075 1.95t-1.7.95H10v1q0 .825-.587 1.413T8 15\"></path></svg>");
function Cp(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Sp();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/TTS/TTSVoices.svelte
function wp(e, t) {
	Kt(t, !0);
	let n = H(t, "voice", 7), r = /* @__PURE__ */ O(null);
	function i(e) {
		U.settings.ttsVoiceByLang[t.targetLang] = e;
	}
	gf(e, {
		align: "center",
		onchange: (e) => i(e.name),
		get quick() {
			return U.motionDisabled;
		},
		get triggerRef() {
			return P(r);
		},
		get value() {
			return n();
		},
		set value(e) {
			n(e);
		},
		listboxButton: (e, t) => {
			let i = () => t?.().toggle, a = () => t?.().open;
			ed(e, {
				get active() {
					return a();
				},
				color: "standard",
				get onclick() {
					return i();
				},
				size: "xs",
				get title() {
					return n().name;
				},
				get ref() {
					return P(r);
				},
				set ref(e) {
					k(r, e, !0);
				},
				children: (e, t) => {
					Cp(e, {});
				},
				$$slots: { default: !0 }
			});
		},
		children: (e, n) => {
			var r = Ji();
			Ca(j(r), 16, () => t.voices, (e) => e, (e, t, n, r) => {
				Df(e, {
					get label() {
						return t.name;
					},
					size: "xs",
					get value() {
						return t;
					},
					leadingIcon: (e, t = Pe) => {
						var n = Ji(), r = j(n), i = (e) => {
							kf(e, {});
						};
						L(r, (e) => {
							t() && e(i);
						}), I(e, n);
					},
					$$slots: { leadingIcon: !0 }
				});
			}), I(e, r);
		},
		$$slots: {
			listboxButton: !0,
			default: !0
		}
	}), qt();
}
//#endregion
//#region ~icons/material-symbols/no-sound-outline-rounded.svelte
var Tp = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"m18 13.4l-1.9 1.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l1.9-1.9l-1.9-1.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l1.9 1.9l1.9-1.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L19.4 12l1.9 1.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275zM7 15H4q-.425 0-.712-.288T3 14v-4q0-.425.288-.712T4 9h3l3.3-3.3q.475-.475 1.088-.213t.612.938v11.15q0 .675-.612.938T10.3 18.3zm3-6.15L7.85 11H5v2h2.85L10 15.15zM7.5 12\"></path></svg>");
function Ep(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Tp();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/volume-up-outline-rounded.svelte
var Dp = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M19 11.975q0-2.075-1.1-3.787t-2.95-2.563q-.375-.175-.55-.537t-.05-.738q.15-.4.538-.575t.787 0Q18.1 4.85 19.55 7.063T21 11.974t-1.45 4.913t-3.875 3.287q-.4.175-.788 0t-.537-.575q-.125-.375.05-.737t.55-.538q1.85-.85 2.95-2.562t1.1-3.788M7 15H4q-.425 0-.712-.288T3 14v-4q0-.425.288-.712T4 9h3l3.3-3.3q.475-.475 1.088-.213t.612.938v11.15q0 .675-.612.938T10.3 18.3zm9.5-3q0 1.05-.475 1.988t-1.25 1.537q-.25.15-.513.013T14 15.1V8.85q0-.3.263-.437t.512.012q.775.625 1.25 1.575t.475 2M10 8.85L7.85 11H5v2h2.85L10 15.15zM7.5 12\"></path></svg>");
function Op(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Dp();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/TTS/utils/tts.ts
var kp = async () => new Promise((e) => {
	try {
		let t = speechSynthesis.getVoices();
		if (t.length > 0) e(t);
		else {
			let n = setInterval(() => {
				t = speechSynthesis.getVoices(), t.length > 0 && (clearInterval(n), e(t));
			}, 100);
			setTimeout(() => {
				t.length === 0 && (clearInterval(n), e([]));
			}, 1e3);
		}
	} catch (t) {
		console.debug(t), e([]);
	}
}), Ap = (e, t) => t ? t.filter((t) => t.lang.startsWith(e)) : [], jp = (e, t, n) => n && t.find((t) => t.lang.startsWith(e)) ? new bp() : new xp(), Mp = /* @__PURE__ */ F("<!> <!>", 1);
function Np(e, t) {
	Kt(t, !0);
	let n = H(t, "showTTSVoices", 3, !0), r = /* @__PURE__ */ D(() => U.settings.ttsProvider === Io.Auto), i = /* @__PURE__ */ D(() => jp(t.targetLang, t.voices, P(r))), a = /* @__PURE__ */ D(() => P(i).status), o = /* @__PURE__ */ D(() => P(a)?.error ? l.i18n.getMessage("tooltip_listen_language_is_not_support") : P(a)?.speaking ? l.i18n.getMessage("tooltip_listen_stop") : l.i18n.getMessage("tooltip_listen_to_the_text")), s = /* @__PURE__ */ D(() => U.settings.ttsVoiceByLang && U.settings.ttsVoiceByLang[t.targetLang] ? t.voices.find((e) => e.name === U.settings.ttsVoiceByLang[t.targetLang]) : t.voices[0]), c = /* @__PURE__ */ D(() => P(a)?.error ? Ep : P(a)?.waiting ? Bf : P(a)?.speaking ? rp : Op), u = /* @__PURE__ */ D(() => !!t.voices.length && n() && P(r));
	function d() {
		P(i) instanceof bp ? P(i)?.speak({
			text: t.text,
			voice: P(s)
		}) : P(i) instanceof xp && P(i)?.speak({
			targetLang: t.targetLang,
			text: t.text
		});
	}
	function f() {
		P(i)?.stop();
	}
	function p() {
		P(a) && (P(a).speaking ? f() : d());
	}
	pa(() => {
		f();
	});
	var m = Mp(), h = j(m);
	{
		let e = /* @__PURE__ */ D(() => P(a)?.error || !t.text);
		ed(h, {
			color: "standard",
			get disabled() {
				return P(e);
			},
			onclick: p,
			size: "xs",
			get title() {
				return P(o);
			},
			children: (e, t) => {
				var n = Ji(), r = j(n);
				{
					let e = /* @__PURE__ */ D(() => [P(a)?.waiting && "animate-spin"]);
					Aa(r, () => P(c), (t, n) => {
						n(t, { get class() {
							return P(e);
						} });
					});
				}
				I(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	var g = M(h, 2), _ = (e) => {
		wp(e, {
			get targetLang() {
				return t.targetLang;
			},
			get voice() {
				return P(s);
			},
			get voices() {
				return t.voices;
			}
		});
	};
	L(g, (e) => {
		P(s) && P(u) && e(_);
	}), I(e, m), qt();
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/TTS/TTS.svelte
function Pp(e, t) {
	Kt(t, !0);
	let n = kp();
	var r = Ji();
	va(j(r), () => n, (e) => {
		Vf(e, { class: "size-6" });
	}, (e, n) => {
		{
			let r = /* @__PURE__ */ D(() => Ap(t.targetLang, P(n)));
			Np(e, {
				get targetLang() {
					return t.targetLang;
				},
				get text() {
					return t.text;
				},
				get voices() {
					return P(r);
				}
			});
		}
	}), I(e, r), qt();
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/easing/index.js
function Fp(e) {
	let t = e - 1;
	return t * t * t + 1;
}
//#endregion
//#region node_modules/.pnpm/svelte@5.55.4_@typescript-eslint+types@8.58.2/node_modules/svelte/src/animate/index.js
function Ip(e, { from: t, to: n }, r = {}) {
	var { delay: i = 0, duration: a = (e) => Math.sqrt(e) * 120, easing: o = Fp } = r, s = getComputedStyle(e), c = s.transform === "none" ? "" : s.transform, [l, u] = s.transformOrigin.split(" ").map(parseFloat);
	l /= e.clientWidth, u /= e.clientHeight;
	var d = Lp(e), f = e.clientWidth / n.width / d, p = e.clientHeight / n.height / d, m = t.left + t.width * l, h = t.top + t.height * u, g = n.left + n.width * l, _ = n.top + n.height * u, v = (m - g) * f, y = (h - _) * p, b = t.width / n.width, x = t.height / n.height;
	return {
		delay: i,
		duration: typeof a == "function" ? a(Math.sqrt(v * v + y * y)) : a,
		easing: o,
		css: (e, t) => `transform: ${c} translate(${t * v}px, ${t * y}px) scale(${e + t * b}, ${e + t * x});`
	};
}
function Lp(e) {
	if ("currentCSSZoom" in e) return e.currentCSSZoom;
	for (var t = e, n = 1; t !== null;) n *= +getComputedStyle(t).zoom, t = t.parentElement;
	return n;
}
//#endregion
//#region src/lib/SelectLanguage/lib/context.ts
var [Rp, zp] = Ht(), Bp = /* @__PURE__ */ function(e) {
	return e.First = "first", e.Prev = "prev", e.Next = "next", e.Last = "last", e.PrevColumn = "prevColumn", e.NextColumn = "nextColumn", e;
}({});
function Vp(e) {
	let t = document.activeElement?.shadowRoot?.activeElement ?? document.activeElement;
	return e.indexOf(t);
}
function Hp(e, t, n, r = 1) {
	let i = Math.ceil(n / r);
	switch (e) {
		case Bp.First: return 0;
		case Bp.Last: return n - 1;
		case Bp.Next: return t === -1 ? 0 : (t + 1) % n;
		case Bp.Prev: return t === -1 ? n - 1 : (t - 1 + n) % n;
		case Bp.NextColumn: {
			if (t === -1) return 0;
			let e = Math.floor(t / i), a = t % i, o = (e + 1) % r * i + a;
			return o < n ? o : n - 1;
		}
		case Bp.PrevColumn: {
			if (t === -1) return 0;
			let e = Math.floor(t / i), n = t % i;
			return (e - 1 + r) % r * i + n;
		}
	}
}
function Up(e, t, n = 1) {
	e[Hp(t, Vp(e), e.length, n)]?.focus();
}
//#endregion
//#region src/lib/SelectLanguage/lib/Listbox.svelte
var Wp = /* @__PURE__ */ F("<div><div class=\"z-1 w-full\"><!></div> <div id=\"animate-child\" role=\"listbox\" tabindex=\"-1\"><!></div></div>"), Gp = /* @__PURE__ */ F("<span class=\"relative\"><!> <!></span>");
function Kp(e, t) {
	Kt(t, !0);
	let n = H(t, "value", 15), r = H(t, "open", 15, !1), i = H(t, "triggerRef", 7, null), a = H(t, "align", 3, "start"), o = H(t, "quick", 3, !1), s = H(t, "columns", 3, 1), c = H(t, "scrollToSelected", 3, !1), l = /* @__PURE__ */ O(null), u = /* @__PURE__ */ O(null), d = /* @__PURE__ */ O(!1), f = /* @__PURE__ */ D(() => xd[a()]), p = /* @__PURE__ */ D(() => o() ? 0 : 300), m = /* @__PURE__ */ D(() => o() ? 0 : 150), h = /* @__PURE__ */ D(() => P(d) ? 20 : -20);
	function g() {
		if (i()) {
			let e = i().getBoundingClientRect();
			k(d, window.innerHeight - e.bottom < 384);
		}
		r(!0);
	}
	function _() {
		r() ? y() : g();
	}
	function v() {
		r(!1);
	}
	async function y() {
		r(!1), await Ti(), i()?.focus();
	}
	function b() {
		_d(P(l), "option")[0]?.focus();
	}
	zp({
		get value() {
			return n();
		},
		set value(e) {
			n() !== e && (n(e), t.onchange?.(e));
		},
		get open() {
			return r();
		},
		get triggerRef() {
			return i();
		},
		set triggerRef(e) {
			i(e);
		},
		get searchRef() {
			return P(u);
		},
		set searchRef(e) {
			k(u, e, !0);
		},
		toggle: _,
		openListbox: g,
		close: v,
		closeWithFocus: y,
		focusFirstItem: b
	});
	function x(e) {
		let t = _d(P(l), "option");
		switch (e.code) {
			case fd.ArrowDown:
				e.preventDefault(), Up(t, Bp.Next);
				break;
			case fd.ArrowUp:
				e.preventDefault(), Up(t, Bp.Prev);
				break;
			case fd.ArrowRight:
				e.preventDefault(), Up(t, Bp.NextColumn, s());
				break;
			case fd.ArrowLeft:
				e.preventDefault(), Up(t, Bp.PrevColumn, s());
				break;
			case fd.Home:
				e.preventDefault(), Up(t, Bp.First);
				break;
			case fd.End:
				e.preventDefault(), Up(t, Bp.Last);
				break;
			case fd.Tab:
				r(!1);
				break;
			case fd.Escape:
				y();
				break;
			default: {
				let t = e.key.length === 1, n = e.code === fd.Backspace;
				(t || n) && P(u)?.focus();
				break;
			}
		}
	}
	function ee(e) {
		switch (e.code) {
			case fd.ArrowDown:
			case fd.ArrowUp:
				e.preventDefault(), g();
				break;
		}
	}
	function S() {
		return _d(P(l), "option").find((e) => e.ariaSelected === "true");
	}
	function C() {
		c() && S()?.scrollIntoView({ block: "nearest" });
	}
	var te = Gp(), ne = A(te);
	da(ne, () => t.listboxButton, () => ({
		toggle: _,
		open: r(),
		value: n(),
		triggerKeydown: ee
	}));
	var re = M(ne, 2), ie = (e) => {
		var n = Wp(), r = A(n);
		da(A(r), () => t.listboxSearch), E(r);
		var i = M(r, 2);
		z(i, 1, R(["flex flex-col justify-between gap-0.5 p-1 select-none", "scrollbar overflow-x-clip overflow-y-auto focus:outline-none"])), da(A(i), () => t.children), E(i), Co(i, (e) => k(l, e), () => P(l)), E(n), N(() => z(n, 1, R([
			"absolute z-20 flex max-h-96 flex-col overflow-hidden rounded-lg shadow-sm",
			"bg-color-surface-container-low",
			P(d) ? "bottom-full" : "top-full",
			P(f)
		]))), Ii("introstart", n, C), Li("keydown", i, x), Va(1, n, () => us, () => ({
			y: P(h),
			duration: P(p),
			easing: ud
		})), Va(2, n, () => us, () => ({
			y: P(h),
			duration: P(m)
		})), I(e, n);
	};
	L(re, (e) => {
		r() && e(ie);
	}), E(te), Ua(te, (e) => pf?.(e)), Ii("clickoutside", te, () => r(!1)), I(e, te), qt();
}
Ri(["keydown"]);
//#endregion
//#region src/lib/SelectLanguage/lib/ListboxOption.svelte
var qp = /* @__PURE__ */ F("<span><!></span>"), Jp = /* @__PURE__ */ F("<span><!></span>"), Yp = /* @__PURE__ */ F("<li role=\"option\" tabindex=\"-1\"><span></span> <div class=\"relative flex w-full items-center gap-2\"><!> <span></span> <!></div></li>");
function Xp(e, t) {
	Kt(t, !0);
	let n = Rp(), r = /* @__PURE__ */ D(() => t.value === n.value);
	function i() {
		n.value = t.value, t.keepOpen || n.closeWithFocus();
	}
	function a(e) {
		(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), i());
	}
	var o = Yp();
	z(o, 1, R([
		"group/lang relative flex h-8 min-w-40 shrink-0 cursor-pointer rounded-sm px-3",
		"outline-color-secondary focus-visible:outline-menu",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0",
		"aria-disabled:pointer-events-none aria-disabled:opacity-disabled",
		"aria-selected:rounded-xl aria-selected:bg-color-tertiary-container"
	]));
	var s = A(o);
	z(s, 1, R([
		"pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity ease-effects-fast",
		"group-hover/lang:opacity-hover group-focus-visible/lang:opacity-pressed group-active/lang:opacity-pressed group-aria-disabled/lang:opacity-pressed",
		"bg-color-on-surface group-aria-selected/lang:bg-color-on-tertiary-container"
	]));
	var c = M(s, 2), l = A(c), u = (e) => {
		var n = qp();
		z(n, 1, R(["[&_svg]:size-5 [&:not(:has(svg))]:hidden", "text-color-on-surface-variant group-aria-selected/lang:text-color-on-tertiary-container"])), da(A(n), () => t.leadingIcon, () => P(r)), E(n), I(e, n);
	};
	L(l, (e) => {
		t.leadingIcon && e(u);
	});
	var d = M(l, 2);
	z(d, 1, R(["flex-1 text-sm font-medium whitespace-nowrap", "text-color-on-surface group-aria-selected/lang:text-color-on-tertiary-container"])), ka(d, () => t.label, !0), E(d);
	var f = M(d, 2), p = (e) => {
		var n = Jp();
		z(n, 1, R(["[&_svg]:size-5 [&:not(:has(svg))]:hidden", "text-color-on-surface-variant group-aria-selected/lang:text-color-on-tertiary-container"])), da(A(n), () => t.trailingIcon, () => P(r)), E(n), I(e, n);
	};
	L(f, (e) => {
		t.trailingIcon && e(p);
	}), E(c), E(o), N(() => {
		mo(o, "aria-disabled", t.disabled), mo(o, "aria-selected", P(r));
	}), Li("click", o, i), Li("keydown", o, a), I(e, o), qt();
}
Ri(["click", "keydown"]);
//#endregion
//#region src/lib/base/TextField.svelte
var Zp = /* @__PURE__ */ F("<span aria-hidden=\"true\">*</span>"), Qp = /* @__PURE__ */ F("<span> <!></span>"), $p = /* @__PURE__ */ F("<span></span>"), em = /* @__PURE__ */ F("<span aria-hidden=\"true\"><!></span>"), tm = /* @__PURE__ */ F("<span><!></span>"), nm = /* @__PURE__ */ F("<span class=\"text-xs text-color-error\"> </span>"), rm = /* @__PURE__ */ F("<span class=\"text-xs text-color-on-surface-variant\"> </span>"), im = /* @__PURE__ */ F("<label><!> <span><!> <span></span> <span><!> <span class=\"w-full px-4\"><input/></span> <!></span></span> <!></label>");
function am(e, t) {
	Kt(t, !0);
	let n = Qu({
		slots: {
			base: ["group/input flex cursor-text flex-col gap-1", "has-disabled:pointer-events-none has-disabled:opacity-disabled"],
			labelClass: "inline-flex items-center text-sm text-color-on-surface",
			container: ["relative flex rounded-t-sm py-2", "[&_svg]:pointer-events-none [&_svg]:shrink-0"],
			stateLayer: "",
			outline: [
				"pointer-events-none absolute inset-0 rounded-[inherit]",
				"before:absolute before:inset-0 before:rounded-[inherit]",
				"before:transition-[border-color] before:ease-effects-fast group-hover/input:before:border-color-on-surface",
				"after:absolute after:inset-0 after:rounded-[inherit] after:border-color-primary after:opacity-0",
				"after:transition-opacity after:ease-effects-fast group-has-focus/input:after:opacity-100 group-has-active/input:after:opacity-100"
			],
			content: "relative flex w-full items-center",
			inputClass: "w-full text-base text-color-on-surface caret-color-primary outline-none placeholder:text-color-on-surface-variant",
			iconClass: "text-color-on-surface-variant [&:not(:has(svg))]:hidden [&>svg]:size-6"
		},
		variants: {
			variant: {
				filled: {
					container: "bg-color-surface-container-highest",
					stateLayer: ["pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity ease-effects-fast", "bg-color-on-surface opacity-0 group-hover/input:opacity-hover"],
					outline: "before:border-b before:border-b-color-on-surface-variant after:border-b-3"
				},
				outlined: {
					container: "rounded-b-sm",
					outline: "before:border before:border-color-outline after:border-3"
				}
			},
			error: { true: {
				labelClass: "text-color-error",
				outline: "before:border-color-error group-hover/input:before:border-color-error after:border-color-error",
				inputClass: "caret-color-error"
			} }
		},
		defaultVariants: { variant: "filled" }
	}), r = H(t, "value", 15, ""), i = H(t, "ref", 15, null), a = H(t, "variant", 3, "filled"), o = H(t, "label", 3, ""), s = H(t, "supportingText", 3, ""), c = H(t, "error", 3, !1), l = H(t, "errorText", 3, ""), u = H(t, "type", 3, "text"), d = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy",
		"value",
		"ref",
		"variant",
		"label",
		"supportingText",
		"error",
		"errorText",
		"class",
		"leadingIcon",
		"trailingIcon",
		"type",
		"required"
	]), { base: f, labelClass: p, container: m, stateLayer: h, outline: g, content: _, inputClass: v, iconClass: y } = n();
	var b = im(), x = A(b), ee = (e) => {
		var n = Qp(), r = A(n), i = M(r), a = (e) => {
			I(e, Zp());
		};
		L(i, (e) => {
			t.required && e(a);
		}), E(n), N((e) => {
			z(n, 1, e), ia(r, `${o() ?? ""} `);
		}, [() => R(p({ error: c() }))]), I(e, n);
	};
	L(x, (e) => {
		o() && e(ee);
	});
	var S = M(x, 2), C = A(S), te = (e) => {
		var t = $p();
		N((e) => z(t, 1, e), [() => R(h({
			variant: a(),
			error: c()
		}))]), I(e, t);
	};
	L(C, (e) => {
		a() === "filled" && e(te);
	});
	var ne = M(C, 2), re = M(ne, 2), ie = A(re), ae = (e) => {
		var n = em();
		da(A(n), () => t.leadingIcon), E(n), N((e) => z(n, 1, e), [() => R(y({ class: "pl-3" }))]), I(e, n);
	};
	L(ie, (e) => {
		t.leadingIcon && e(ae);
	});
	var oe = M(ie, 2), se = A(oe);
	B(se, (e) => ({
		class: e,
		"aria-invalid": c() || void 0,
		required: t.required,
		type: u(),
		...d
	}), [() => v({ error: c() })], void 0, void 0, void 0, !0), Co(se, (e) => i(e), () => i()), E(oe);
	var ce = M(oe, 2), le = (e) => {
		var n = tm();
		da(A(n), () => t.trailingIcon), E(n), N((e) => z(n, 1, e), [() => R(y({ class: "pr-3" }))]), I(e, n);
	};
	L(ce, (e) => {
		t.trailingIcon && e(le);
	}), E(re), E(S);
	var ue = M(S, 2), de = (e) => {
		var t = nm(), n = A(t, !0);
		E(t), N(() => ia(n, l())), I(e, t);
	}, w = (e) => {
		var t = rm(), n = A(t, !0);
		E(t), N(() => ia(n, s())), I(e, t);
	};
	L(ue, (e) => {
		c() && l() ? e(de) : s() && e(w, 1);
	}), E(b), N((e, t, n, r) => {
		z(b, 1, e), z(S, 1, t), z(ne, 1, n), z(re, 1, r);
	}, [
		() => R(f({ class: t.class })),
		() => R(m({ variant: a() })),
		() => R(g({
			variant: a(),
			error: c()
		})),
		() => R(_())
	]), yo(se, r), I(e, b), qt();
}
//#endregion
//#region ~icons/material-symbols/cancel-outline-rounded.svelte
var om = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"m12 13.4l2.9 2.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7L13.4 12l2.9-2.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275L12 10.6L9.1 7.7q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l2.9 2.9l-2.9 2.9q-.275.275-.275.7t.275.7t.7.275t.7-.275zm0 8.6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8\"></path></svg>");
function sm(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = om();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/search-rounded.svelte
var cm = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14\"></path></svg>");
function lm(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = cm();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/lib/SelectLanguage/lib/ListboxSearch.svelte
var um = /* @__PURE__ */ F("<span><!></span>");
function dm(e, t) {
	Kt(t, !0);
	let n = H(t, "value", 15, ""), r = Rp(), i = /* @__PURE__ */ O(null);
	function a() {
		n(""), P(i)?.focus();
	}
	function o(e) {
		switch (e.code) {
			case fd.ArrowDown:
				e.preventDefault(), r.focusFirstItem();
				break;
			case fd.Tab:
				r.close();
				break;
			case fd.Escape:
				e.preventDefault(), n() === "" ? r.closeWithFocus() : n("");
				break;
		}
	}
	fa(() => {
		n(""), P(i)?.focus(), r.searchRef = P(i);
	}), am(e, {
		name: "language-search",
		autocomplete: "off",
		onkeydown: o,
		placeholder: l.i18n.getMessage("select_language_search_placeholder"),
		type: "search",
		get value() {
			return n();
		},
		set value(e) {
			n(e);
		},
		get ref() {
			return P(i);
		},
		set ref(e) {
			k(i, e, !0);
		},
		leadingIcon: (e) => {
			var t = um();
			lm(A(t), { class: "size-5" }), E(t), I(e, t);
		},
		trailingIcon: (e) => {
			ed(e, {
				class: "-mx-1.5 -my-1",
				color: "standard",
				onclick: a,
				size: "xs",
				title: l.i18n.getMessage("tooltip_clear_search"),
				children: (e, t) => {
					sm(e, {});
				},
				$$slots: { default: !0 }
			});
		},
		$$slots: {
			leadingIcon: !0,
			trailingIcon: !0
		}
	}), qt();
}
//#endregion
//#region src/lib/base/Button.svelte
var fm = /* @__PURE__ */ F("<span aria-hidden=\"true\"><!></span>"), pm = /* @__PURE__ */ F("<span> </span>"), mm = /* @__PURE__ */ F("<span aria-hidden=\"true\"><!></span>"), hm = /* @__PURE__ */ F("<button><span></span> <span><!> <!> <!></span></button>");
function gm(e, t) {
	Kt(t, !0);
	let n = Qu({
		slots: {
			base: [
				"group relative flex cursor-pointer items-center select-none",
				"outline-color-secondary transition-shape-colors focus-visible:outline-common",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				"disabled:pointer-events-none disabled:cursor-default disabled:bg-color-on-surface/10",
				"transform-gpu"
			],
			stateLayer: ["pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity ease-effects-fast", "group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed"],
			content: "relative flex w-full items-center group-disabled:text-color-on-surface group-disabled:opacity-disabled",
			iconClass: "",
			labelClass: "max-w-full truncate font-medium whitespace-nowrap"
		},
		variants: {
			color: {
				filled: {
					base: "bg-color-primary",
					content: "text-color-on-primary",
					stateLayer: "bg-color-on-primary"
				},
				tonal: {
					base: "bg-color-secondary-container",
					content: "text-color-on-secondary-container",
					stateLayer: "bg-color-on-secondary-container"
				},
				outlined: {
					base: "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-color-outline-variant",
					content: "text-color-on-surface-variant",
					stateLayer: "bg-color-on-surface-variant"
				},
				text: {
					content: "text-color-primary",
					stateLayer: "bg-color-primary"
				}
			},
			size: {
				xs: {
					base: "h-8 rounded-2xl px-3",
					content: "gap-1",
					iconClass: "[&_svg]:size-5",
					labelClass: "text-sm"
				},
				sm: {
					base: "h-10 rounded-20 px-4",
					content: "gap-2",
					iconClass: "[&_svg]:size-5",
					labelClass: "text-sm"
				},
				md: {
					base: "h-14 rounded-28 px-6",
					content: "gap-2",
					iconClass: "[&_svg]:size-6",
					labelClass: "text-base"
				},
				lg: {
					base: "h-24 rounded-48 px-12",
					content: "gap-3",
					iconClass: "[&_svg]:size-8",
					labelClass: "text-2xl"
				}
			},
			toggle: { true: "" },
			shape: {
				round: "",
				square: ""
			},
			shapeMorph: { true: "" },
			active: { true: { stateLayer: "opacity-pressed!" } }
		},
		compoundVariants: [
			{
				color: "filled",
				toggle: !0,
				class: {
					base: "bg-color-surface-container aria-pressed:bg-color-primary",
					content: "text-color-on-surface-variant group-aria-pressed:text-color-on-primary",
					stateLayer: "bg-color-on-surface-variant group-aria-pressed:bg-color-on-primary"
				}
			},
			{
				color: "tonal",
				toggle: !0,
				class: {
					base: "bg-color-secondary-container aria-pressed:bg-color-secondary",
					content: "text-color-on-secondary-container group-aria-pressed:text-color-on-secondary",
					stateLayer: "bg-color-on-secondary-container group-aria-pressed:bg-color-on-secondary"
				}
			},
			{
				color: "outlined",
				toggle: !0,
				class: {
					base: "aria-pressed:bg-color-inverse-surface aria-pressed:before:border-color-inverse-surface",
					content: "text-color-on-surface-variant group-aria-pressed:text-color-inverse-on-surface",
					stateLayer: "bg-color-on-surface-variant group-aria-pressed:bg-color-inverse-on-surface"
				}
			},
			{
				shape: "round",
				toggle: !0,
				size: "xs",
				class: "aria-pressed:rounded-xl"
			},
			{
				shape: "round",
				toggle: !0,
				size: "sm",
				class: "aria-pressed:rounded-xl"
			},
			{
				shape: "round",
				toggle: !0,
				size: "md",
				class: "aria-pressed:rounded-2xl"
			},
			{
				shape: "round",
				toggle: !0,
				size: "lg",
				class: "aria-pressed:rounded-28"
			},
			{
				shape: "square",
				size: "xs",
				class: "rounded-xl aria-pressed:rounded-2xl"
			},
			{
				shape: "square",
				size: "sm",
				class: "rounded-xl aria-pressed:rounded-20"
			},
			{
				shape: "square",
				size: "md",
				class: "rounded-2xl aria-pressed:rounded-28"
			},
			{
				shape: "square",
				size: "lg",
				class: "rounded-28 aria-pressed:rounded-48"
			},
			{
				shapeMorph: !0,
				size: ["xs", "sm"],
				class: "enabled:active:rounded-lg"
			},
			{
				shapeMorph: !0,
				size: "md",
				class: "enabled:active:rounded-xl"
			},
			{
				shapeMorph: !0,
				size: "lg",
				class: "enabled:active:rounded-2xl"
			},
			{
				color: "outlined",
				size: "lg",
				class: "before:border-2"
			}
		],
		defaultVariants: {
			color: "filled",
			size: "sm"
		}
	}), r = H(t, "ref", 15, null), i = H(t, "type", 3, "button"), a = H(t, "class", 3, ""), o = H(t, "size", 3, "sm"), s = H(t, "color", 3, "filled"), c = H(t, "shape", 3, "round"), l = H(t, "selected", 15, !1), u = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy",
		"label",
		"ref",
		"type",
		"leadingIcon",
		"selectedIcon",
		"trailingIcon",
		"selectedTrailingIcon",
		"class",
		"size",
		"color",
		"shape",
		"shapeMorph",
		"toggle",
		"selected",
		"active",
		"onclick"
	]), d = /* @__PURE__ */ D(() => t.toggle ? l() : void 0), f = (e) => {
		t.toggle && l(!l()), t.onclick?.(e);
	}, { base: p, content: m, stateLayer: h, labelClass: g, iconClass: _ } = n();
	var v = hm();
	B(v, (e) => ({
		class: e,
		"aria-pressed": P(d),
		onclick: f,
		type: i(),
		...u
	}), [() => p({
		size: o(),
		color: s(),
		shape: c(),
		toggle: t.toggle,
		shapeMorph: t.shapeMorph,
		class: a()
	})]);
	var y = A(v), b = M(y, 2), x = A(b), ee = (e) => {
		var n = fm(), r = A(n), i = (e) => {
			var n = Ji();
			da(j(n), () => t.selectedIcon, l), I(e, n);
		}, a = (e) => {
			var n = Ji();
			da(j(n), () => t.leadingIcon, l), I(e, n);
		};
		L(r, (e) => {
			l() && t.selectedIcon ? e(i) : e(a, -1);
		}), E(n), N((e) => z(n, 1, e), [() => R(_({ size: o() }))]), I(e, n);
	};
	L(x, (e) => {
		t.leadingIcon && e(ee);
	});
	var S = M(x, 2), C = (e) => {
		var n = pm(), r = A(n, !0);
		E(n), N((e) => {
			z(n, 1, e), ia(r, t.label);
		}, [() => R(g({
			size: o(),
			color: s()
		}))]), I(e, n);
	};
	L(S, (e) => {
		t.label && e(C);
	});
	var te = M(S, 2), ne = (e) => {
		var n = mm(), r = A(n), i = (e) => {
			var n = Ji();
			da(j(n), () => t.selectedTrailingIcon, l), I(e, n);
		}, a = (e) => {
			var n = Ji();
			da(j(n), () => t.trailingIcon, l), I(e, n);
		};
		L(r, (e) => {
			l() && t.selectedTrailingIcon ? e(i) : e(a, -1);
		}), E(n), N((e) => z(n, 1, e), [() => R(_({ size: o() }))]), I(e, n);
	};
	L(te, (e) => {
		t.trailingIcon && e(ne);
	}), E(b), E(v), Co(v, (e) => r(e), () => r()), N((e, t) => {
		z(y, 1, e), z(b, 1, t);
	}, [() => R(h({
		color: s(),
		active: t.active,
		toggle: t.toggle
	})), () => R(m({
		size: o(),
		color: s(),
		toggle: t.toggle
	}))]), I(e, v), qt();
}
//#endregion
//#region ~icons/material-symbols/keep-off-outline-rounded.svelte
var _m = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M14 5h-4v2.175l-2.75-2.75q-.125-.125-.187-.275T7 3.85q0-.325.225-.588t.6-.262H16q.425 0 .713.287T17 4q0 .4-.363.563T16 5v6q0 .425-.288.713T15 12t-.712-.288T14 11zm-3 17v-6H7.4q-.625 0-1-.437t-.375-.988q0-.275.113-.55T6.5 13.5L8 12v-1.15L2.1 4.9q-.275-.275-.288-.687T2.1 3.5q.275-.275.7-.275t.7.275l16.975 16.975q.3.3.288.713t-.313.712q-.3.275-.7.288t-.7-.288l-5.9-5.9H13v6q0 .425-.288.713T12 23t-.712-.288T11 22m-2.15-8h2.3l-1.1-1.1l-.05-.05zm1.2-1.1\"></path></svg>");
function vm(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = _m();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/keep-outline-rounded.svelte
var ym = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M16 5v7l1.7 1.7q.15.15.225.338t.075.387V15q0 .425-.288.712T17 16h-4v5.85q0 .425-.288.713T12 22.85t-.712-.288T11 21.85V16H7q-.425 0-.712-.288T6 15v-.575q0-.2.075-.387T6.3 13.7L8 12V5q-.425 0-.712-.288T7 4t.288-.712T8 3h8q.425 0 .713.288T17 4t-.288.713T16 5m-7.15 9h6.3L14 12.85V5h-4v7.85zM12 14\"></path></svg>");
function bm(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = ym();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/auto-awesome-rounded.svelte
var xm = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M19 8.3q-.125 0-.263-.075T18.55 8l-.8-1.75l-1.75-.8q-.15-.05-.225-.187T15.7 5q0-.125.075-.262T16 4.55l1.75-.8l.8-1.75q.05-.15.188-.225T19 1.7q.125 0 .263.075T19.45 2l.8 1.75l1.75.8q.15.05.225.188T22.3 5q0 .125-.075.263T22 5.45l-1.75.8l-.8 1.75q-.05.15-.188.225T19 8.3Zm0 14q-.125 0-.263-.075T18.55 22l-.8-1.75l-1.75-.8q-.15-.05-.225-.188T15.7 19q0-.125.075-.263T16 18.55l1.75-.8l.8-1.75q.05-.15.188-.225T19 15.7q.125 0 .263.075t.187.225l.8 1.75l1.75.8q.15.05.225.188T22.3 19q0 .125-.075.263T22 19.45l-1.75.8l-.8 1.75q-.05.15-.188.225T19 22.3ZM9 18.575q-.275 0-.525-.15T8.1 18l-1.6-3.5L3 12.9q-.275-.125-.425-.375T2.425 12q0-.275.15-.525T3 11.1l3.5-1.6L8.1 6q.125-.275.375-.425T9 5.425q.275 0 .525.15T9.9 6l1.6 3.5l3.5 1.6q.275.125.425.375t.15.525q0 .275-.15.525T15 12.9l-3.5 1.6L9.9 18q-.125.275-.375.425t-.525.15Z\"></path></svg>");
function Sm(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = xm();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/lib/SelectLanguage/SelectLanguage.svelte
var Cm = /* @__PURE__ */ F("<!> <div class=\"mx-2 my-1 h-px shrink-0 bg-color-outline-variant\"></div>", 1), wm = /* @__PURE__ */ F("<button type=\"button\"><!></button>"), Tm = /* @__PURE__ */ F("<div><!></div>"), Em = /* @__PURE__ */ F("<li class=\"px-3 py-1 text-xs font-medium text-color-on-surface-variant\" aria-hidden=\"true\" role=\"presentation\"></li> <ul class=\"flex flex-1 flex-col gap-0.5\"></ul> <div class=\"mx-2 my-1 h-px shrink-0 bg-color-outline-variant\"></div>", 1), Dm = /* @__PURE__ */ F("<button type=\"button\"><!></button>"), Om = /* @__PURE__ */ F("<p class=\"px-3 py-2 text-sm text-color-on-surface-variant\"></p>"), km = /* @__PURE__ */ F("<ul class=\"flex flex-1 flex-col gap-0.5\"><!> <!> <li class=\"px-3 py-1 text-xs font-medium text-color-on-surface-variant\" aria-hidden=\"true\" role=\"presentation\"></li> <!></ul>");
function Am(e, t) {
	Kt(t, !0);
	let n = H(t, "value", 15, ""), r = H(t, "align", 3, "start"), i = H(t, "autoLang", 3, !1), a = H(t, "mode", 19, () => No.Full), o = H(t, "layout", 19, () => Po.Vert), s = /* @__PURE__ */ O(null), c = /* @__PURE__ */ O(""), u = /* @__PURE__ */ D(() => P(c).trim()), d = /* @__PURE__ */ D(() => U.motionDisabled ? 0 : 350), f = /* @__PURE__ */ D(() => a() === No.Full ? o() === Po.Horiz ? "w-36" : "w-52" : ""), p = /* @__PURE__ */ D(() => Go.map(({ code: e }) => {
		let t = U.settings.pinedLangs.includes(e);
		return {
			code: e,
			language: Yo(e, "name+code"),
			pinned: t,
			pinTitle: l.i18n.getMessage(t ? "select_language_unpin_lang" : "select_language_pin_lang")
		};
	})), m = /* @__PURE__ */ D(() => P(p).filter(({ code: e }) => U.settings.pinedLangs.includes(e))), h = /* @__PURE__ */ D(() => !U.settings.pinedLangs.includes(n())), g = /* @__PURE__ */ D(() => {
		let e = n() === "auto" && t.detectedLang, r = e ? t.detectedLang : n(), i = e ? ` (${l.i18n.getMessage("language_auto")})` : "", o = a() === "full" ? "name" : "code";
		return {
			title: Yo(r, "name+code") + i,
			label: Yo(r, o) + i
		};
	}), _ = /* @__PURE__ */ D(() => {
		if (P(u) === "") return P(p);
		let e = RegExp.escape(P(u)), t = new RegExp(e, "gi");
		return P(p).filter((e) => e.language.toLowerCase().includes(P(u).toLowerCase())).map(({ code: e, language: n, pinned: r, pinTitle: i }) => ({
			code: e,
			language: n.replace(t, "<mark>$&</mark>"),
			pinned: r,
			pinTitle: i
		}));
	});
	function v(e, t) {
		e.stopPropagation(), U.settings.pinedLangs.includes(t) || U.settings.pinedLangs.push(t);
	}
	function y(e, t) {
		e.stopPropagation(), U.settings.pinedLangs = U.settings.pinedLangs.filter((e) => e !== t);
	}
	Kp(e, {
		get align() {
			return r();
		},
		get onchange() {
			return t.onchange;
		},
		get quick() {
			return U.motionDisabled;
		},
		get scrollToSelected() {
			return P(h);
		},
		get triggerRef() {
			return P(s);
		},
		get value() {
			return n();
		},
		set value(e) {
			n(e);
		},
		listboxButton: (e, t) => {
			let n = () => t?.().open, r = () => t?.().toggle, i = () => t?.().triggerKeydown;
			gm(e, {
				get class() {
					return P(f);
				},
				get active() {
					return n();
				},
				color: "text",
				get label() {
					return P(g).label;
				},
				get onclick() {
					return r();
				},
				get onkeydown() {
					return i();
				},
				size: "xs",
				get title() {
					return P(g).title;
				},
				get ref() {
					return P(s);
				},
				set ref(e) {
					k(s, e, !0);
				}
			});
		},
		listboxSearch: (e) => {
			dm(e, {
				get value() {
					return P(c);
				},
				set value(e) {
					k(c, e, !0);
				}
			});
		},
		children: (e, t) => {
			var n = km(), r = A(n), a = (e) => {
				var t = Cm();
				Xp(j(t), {
					get label() {
						return Ko.language;
					},
					get value() {
						return Ko.code;
					},
					leadingIcon: (e, t = Pe) => {
						var n = Ji(), r = j(n), i = (e) => {
							kf(e, {});
						};
						L(r, (e) => {
							t() && e(i);
						}), I(e, n);
					},
					trailingIcon: (e) => {
						Sm(e, {});
					},
					$$slots: {
						leadingIcon: !0,
						trailingIcon: !0
					}
				}), Ot(2), I(e, t);
			};
			L(r, (e) => {
				i() && !P(u) && e(a);
			});
			var o = M(r, 2), s = (e) => {
				var t = Em(), n = j(t);
				n.textContent = l.i18n.getMessage("select_language_pinned");
				var r = M(n, 2);
				Ca(r, 29, () => P(m), ({ code: e, language: t }) => e, (e, t) => {
					let n = () => P(t).code, r = () => P(t).language;
					var i = Tm();
					Xp(A(i), {
						get label() {
							return r();
						},
						get value() {
							return n();
						},
						leadingIcon: (e, t = Pe) => {
							var n = Ji(), r = j(n), i = (e) => {
								kf(e, {});
							};
							L(r, (e) => {
								t() && e(i);
							}), I(e, n);
						},
						trailingIcon: (e) => {
							var t = wm();
							z(t, 1, R([
								"flex size-6 rounded-full p-0.5 hover:bg-color-on-surface/8 active:bg-color-on-surface/16",
								"opacity-0 group-hover/lang:opacity-100 group-focus-visible/lang:opacity-100",
								"transition-opacity ease-effects-fast"
							])), mo(t, "title", l.i18n.getMessage("select_language_unpin_lang")), vm(A(t), {}), E(t), Li("click", t, (e) => y(e, n())), I(e, t);
						},
						$$slots: {
							leadingIcon: !0,
							trailingIcon: !0
						}
					}), E(i), Ba(i, () => Ip, () => ({
						duration: P(d),
						easing: ud
					})), I(e, i);
				}), E(r), Ot(2), I(e, t);
			};
			L(o, (e) => {
				P(m).length && !P(u) && e(s);
			});
			var c = M(o, 2);
			c.textContent = l.i18n.getMessage("select_language_all_langs"), Ca(M(c, 2), 17, () => P(_), ({ code: e, language: t, pinned: n, pinTitle: r }) => e, (e, t) => {
				let n = () => P(t).code, r = () => P(t).language, i = () => P(t).pinned, a = () => P(t).pinTitle;
				Xp(e, {
					get label() {
						return r();
					},
					get value() {
						return n();
					},
					leadingIcon: (e, t = Pe) => {
						var n = Ji(), r = j(n), i = (e) => {
							kf(e, {});
						};
						L(r, (e) => {
							t() && e(i);
						}), I(e, n);
					},
					trailingIcon: (e) => {
						var t = Dm();
						z(t, 1, R([
							"flex size-6 rounded-full p-0.5 hover:bg-color-on-surface/8 active:bg-color-on-surface/16",
							"opacity-0 group-hover/lang:opacity-100 group-focus-visible/lang:opacity-100",
							"transition-opacity ease-effects-fast"
						]));
						var r = A(t), o = (e) => {
							vm(e, {});
						}, s = (e) => {
							bm(e, {});
						};
						L(r, (e) => {
							i() ? e(o) : e(s, -1);
						}), E(t), N(() => mo(t, "title", a())), Li("click", t, (e) => i() ? y(e, n()) : v(e, n())), I(e, t);
					},
					$$slots: {
						leadingIcon: !0,
						trailingIcon: !0
					}
				});
			}, (e) => {
				var t = Om();
				t.textContent = l.i18n.getMessage("select_language_search_no_results"), I(e, t);
			}), E(n), I(e, n);
		},
		$$slots: {
			listboxButton: !0,
			listboxSearch: !0,
			default: !0
		}
	}), qt();
}
Ri(["click"]);
//#endregion
//#region src/entrypoints/content/lib/PopupFull/PopupFull.svelte
var jm = /* @__PURE__ */ F("<div class=\"flex items-center gap-1 p-1\"><span class=\"text-sm text-color-on-surface-variant\"></span> <button class=\"inline-flex flex-wrap gap-x-1 text-start text-sm text-color-primary\" type=\"button\"></button></div>"), Mm = /* @__PURE__ */ F("<p class=\"scrollbar max-h-64 shrink-0 overflow-y-auto px-1.5 text-sm text-color-on-surface-variant\"> </p>"), Nm = /* @__PURE__ */ F("<div class=\"flex items-center gap-1 p-1\"><span class=\"text-sm text-color-on-surface-variant\"></span> <button class=\"inline-flex text-sm text-color-primary\" type=\"button\"> </button></div>"), Pm = /* @__PURE__ */ F("<main><div><div class=\"flex shrink-0 items-center justify-between\"><div class=\"flex items-center gap-1\"><!> <!> <!></div></div> <div class=\"flex h-full min-h-0 flex-col whitespace-pre-line\"><!> <!> <!> <!></div></div> <div></div> <div><div class=\"flex shrink-0 items-center justify-between\"><div class=\"flex items-center gap-1\"><!> <!> <!></div></div> <div><!></div></div></main>");
function Fm(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ D(() => U.settings.popupLayout === Po.Horiz), r = /* @__PURE__ */ D(() => is.isSelectedProviderGoogle ? W.translated?.sentence.trans || "" : W.translationAi?.text || ""), i = /* @__PURE__ */ D(() => U.settings.sourceLang === "auto" && W.detectedLang ? W.detectedLang : U.settings.sourceLang);
	function a(e) {
		W.textToTranslate = e || "", W.reTranslate();
	}
	function o(e) {
		U.settings.sourceLang = e || "auto", W.reTranslate();
	}
	var s = Pm(), c = A(s), u = A(c), d = A(u), f = A(d);
	Am(f, {
		autoLang: !0,
		get detectedLang() {
			return W.detectedLang;
		},
		get layout() {
			return U.settings.popupLayout;
		},
		get onchange() {
			return W.reTranslate;
		},
		get value() {
			return U.settings.sourceLang;
		},
		set value(e) {
			U.settings.sourceLang = e;
		}
	});
	var p = M(f, 2);
	yp(p, { get text() {
		return W.textToTranslate;
	} }), Pp(M(p, 2), {
		get targetLang() {
			return P(i);
		},
		get text() {
			return W.textToTranslate;
		}
	}), E(d), E(u);
	var m = M(u, 2), h = A(m);
	Rf(h, {});
	var g = M(h, 2), _ = (e) => {
		var t = jm(), n = A(t);
		n.textContent = l.i18n.getMessage("popup_perhaps_you_meant");
		var r = M(n, 2);
		ka(r, () => W.translated.spell.spell_html_res, !0), E(r), E(t), Li("click", r, () => a(W.translated?.spell.spell_res)), I(e, t);
	};
	L(g, (e) => {
		W.translated?.spell?.spell_html_res && W.translated.sentence.orig !== W.translated.spell.spell_res && e(_);
	});
	var v = M(g, 2), y = (e) => {
		var t = Mm(), n = A(t, !0);
		E(t), N(() => ia(n, W.translated.sentence.src_translit)), I(e, t);
	};
	L(v, (e) => {
		W.translated && U.settings.showTransliteration && e(y);
	});
	var b = M(v, 2), x = (e) => {
		var t = Nm(), n = A(t);
		n.textContent = l.i18n.getMessage("popup_original_language");
		var r = M(n, 2), i = A(r, !0);
		E(r), E(t), N((e) => ia(i, e), [() => Yo(W.translated?.ld_result.srclangs[0])]), Li("click", r, () => o(W.translated?.ld_result.srclangs[0])), I(e, t);
	};
	L(b, (e) => {
		U.settings.sourceLang !== "auto" && W.translated?.ld_result.srclangs && W.translated?.ld_result.srclangs[0] !== U.settings.sourceLang && e(x);
	}), E(m), E(c);
	var ee = M(c, 2), S = M(ee, 2), C = A(S), te = A(C), ne = A(te);
	Am(ne, {
		get layout() {
			return U.settings.popupLayout;
		},
		get onchange() {
			return W.reTranslate;
		},
		get value() {
			return U.settings.targetLang;
		},
		set value(e) {
			U.settings.targetLang = e;
		}
	});
	var re = M(ne, 2);
	yp(re, { get text() {
		return P(r);
	} }), Pp(M(re, 2), {
		get targetLang() {
			return U.settings.targetLang;
		},
		get text() {
			return P(r);
		}
	}), E(te), E(C);
	var ie = M(C, 2), ae = A(ie), oe = (e) => {
		tp(e, {});
	}, se = (e) => {
		fp(e, {});
	};
	L(ae, (e) => {
		is.isSelectedProviderGoogle || W.isCachedItem ? e(oe) : e(se, -1);
	}), E(ie), E(S), E(s), N(() => {
		z(s, 1, R(["flex min-h-0 flex-1 rounded-xl bg-color-surface-bright", !P(n) && "flex-col"])), z(c, 1, R(["flex min-h-0 flex-col gap-1 p-1", P(n) && "flex-1"])), z(ee, 1, R(["shrink-0 bg-color-surface-dim", P(n) ? "my-2 w-0.5" : "mx-2 h-0.5"])), z(S, 1, R(["flex min-h-0 flex-col gap-1 p-1", P(n) && "flex-1"])), z(ie, 1, R(["scrollbar min-h-0 overflow-y-auto pl-1.5 wrap-break-word whitespace-pre-line", P(n) ? "py-2" : "py-1"]));
	}), I(e, s), qt();
}
Ri(["click"]);
//#endregion
//#region ~icons/material-symbols/swap-horiz-rounded.svelte
var Im = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M5.825 16L7.7 17.875q.275.275.275.688t-.275.712q-.3.3-.712.3t-.713-.3L2.7 15.7q-.15-.15-.213-.325T2.426 15t.063-.375t.212-.325l3.6-3.6q.3-.3.7-.287t.7.312q.275.3.288.7t-.288.7L5.825 14H12q.425 0 .713.288T13 15t-.288.713T12 16zm12.35-6H12q-.425 0-.712-.288T11 9t.288-.712T12 8h6.175L16.3 6.125q-.275-.275-.275-.687t.275-.713q.3-.3.713-.3t.712.3L21.3 8.3q.15.15.212.325t.063.375t-.063.375t-.212.325l-3.6 3.6q-.3.3-.7.288t-.7-.313q-.275-.3-.288-.7t.288-.7z\"></path></svg>");
function Lm(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Im();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupSimple/PopupSimple.svelte
var Rm = Eo(() => U), zm = /* @__PURE__ */ F("<div class=\"flex items-center gap-1\"><!> <!> <!></div>"), Bm = /* @__PURE__ */ F("<div class=\"flex items-center gap-1 py-1\"><span></span> <button class=\"inline-flex text-sm text-blue-600\" type=\"button\"> </button></div>"), Vm = /* @__PURE__ */ F("<div><span class=\"font-medium text-color-primary\"> </span> <span class=\"text-color-on-surface\"> </span></div>"), Hm = /* @__PURE__ */ F("<div class=\"flex flex-col gap-1 pt-2 text-sm\"></div>"), Um = /* @__PURE__ */ F("<div class=\"h-full min-h-0 rounded-xl bg-color-surface-bright p-1\"><div class=\"flex h-full flex-col\"><!> <div class=\"scrollbar overflow-y-auto p-1 wrap-break-word whitespace-pre-line\"><!> <!> <!></div></div></div>");
function Wm(e, t) {
	Kt(t, !1);
	function n(e) {
		Rm(Rm().settings.sourceLang = e || "auto"), W.reTranslate();
	}
	function r() {
		W.reverseTranslation();
	}
	wo();
	var i = Um(), a = A(i), o = A(a), s = (e) => {
		var t = zm(), n = A(t);
		Am(n, {
			align: "center",
			autoLang: !0,
			get detectedLang() {
				return W.detectedLang;
			},
			get mode() {
				return No.Simple;
			},
			get onchange() {
				return W.reTranslate;
			},
			get value() {
				return Rm().settings.sourceLang;
			},
			set value(e) {
				Rm(Rm().settings.sourceLang = e);
			},
			$$legacy: !0
		});
		var i = M(n, 2);
		{
			let e = /* @__PURE__ */ Un(() => !W.detectedLang);
			ed(i, {
				color: "standard",
				get disabled() {
					return P(e);
				},
				onclick: r,
				size: "xs",
				title: l.i18n.getMessage("popup_menu_reverse_translate"),
				children: (e, t) => {
					Lm(e, {});
				},
				$$slots: { default: !0 }
			});
		}
		Am(M(i, 2), {
			align: "center",
			get mode() {
				return No.Simple;
			},
			get onchange() {
				return W.reTranslate;
			},
			get value() {
				return Rm().settings.targetLang;
			},
			set value(e) {
				Rm(Rm().settings.targetLang = e);
			},
			$$legacy: !0
		}), E(t), I(e, t);
	};
	L(o, (e) => {
		Rm().settings.simpleModeShowLangs && e(s);
	});
	var c = M(o, 2), u = A(c), d = (e) => {
		tp(e, {});
	}, f = (e) => {
		fp(e, {});
	};
	L(u, (e) => {
		is.isSelectedProviderGoogle || W.isCachedItem ? e(d) : e(f, -1);
	});
	var p = M(u, 2), m = (e) => {
		var t = Bm(), r = A(t);
		r.textContent = l.i18n.getMessage("popup_original_language");
		var i = M(r, 2), a = A(i, !0);
		E(i), E(t), N((e) => ia(a, e), [() => Yo(W.translated?.ld_result.srclangs[0])]), Li("click", i, () => n(W.translated?.ld_result.srclangs[0])), I(e, t);
	};
	L(p, (e) => {
		Rm().settings.sourceLang !== "auto" && W.translated?.ld_result.srclangs && W.translated?.ld_result.srclangs[0] !== Rm().settings.sourceLang && e(m);
	});
	var h = M(p, 2), g = (e) => {
		var t = Hm();
		Ca(t, 5, () => W.translated.dict, ya, (e, t) => {
			var n = Vm(), r = A(n), i = A(r);
			E(r);
			var a = M(r, 2), o = A(a, !0);
			E(a), E(n), N((e) => {
				ia(i, `${P(t).pos ?? ""}:`), ia(o, e);
			}, [() => P(t).terms.join(", ")]), I(e, n);
		}), E(t), I(e, t);
	};
	L(h, (e) => {
		W.translated?.dict && e(g);
	}), E(c), E(a), E(i), I(e, i), qt();
}
Ri(["click"]);
//#endregion
//#region ~icons/material-symbols/help-outline-rounded.svelte
var Gm = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M12.838 17.638q.362-.363.362-.888t-.362-.888t-.888-.362t-.887.363t-.363.887t.363.888t.887.362t.888-.363M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m.1-12.3q.625 0 1.088.4t.462 1q0 .55-.337.975t-.763.8q-.575.5-1.012 1.1t-.438 1.35q0 .35.263.588t.612.237q.375 0 .638-.25t.337-.625q.1-.525.45-.937t.75-.788q.575-.55.988-1.2t.412-1.45q0-1.275-1.037-2.087T12.1 6q-.95 0-1.812.4T8.975 7.625q-.175.3-.112.638t.337.512q.35.2.725.125t.625-.425q.275-.375.688-.575t.862-.2\"></path></svg>");
function Km(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Gm();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/PopupFooter/lib/Dictionary.svelte
var qm = /* @__PURE__ */ F("<td><span class=\"flex items-center gap-0.5 text-xs text-color-on-surface-variant\" title=\"Indicates how often a translation appears in public documents\"> <!></span></td>"), Jm = /* @__PURE__ */ F("<button type=\"button\"> </button>"), Ym = /* @__PURE__ */ F("<div></div>"), Xm = /* @__PURE__ */ F("<tr class=\"border-b border-color-outline-variant last:border-none\"><td class=\"py-1 align-top\"><button type=\"button\"> </button></td><td class=\"flex flex-wrap gap-1 px-2 py-1\"></td><td class=\"py-1 text-end align-top\"><div class=\"inline-flex w-fit items-center gap-px overflow-hidden rounded-full whitespace-nowrap\"></div></td></tr>"), Zm = /* @__PURE__ */ F("<tr><td class=\"p-2\" colspan=\"3\"></td></tr>"), Qm = /* @__PURE__ */ F("<tr><td class=\"w-full pb-2 font-medium text-color-primary first-letter:uppercase\" colspan=\"2\"> </td><!></tr> <!> <!>", 1), $m = /* @__PURE__ */ F("<div><table class=\"w-full text-sm\"><tbody></tbody></table></div>");
function eh(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ O("");
	function r(e) {
		let t = isNaN(e) ? 0 : e;
		return t < .005 ? [
			1,
			0,
			0
		] : t < .05 ? [
			1,
			1,
			0
		] : [
			1,
			1,
			1
		];
	}
	let i = (e, t) => t === e.length - 1;
	function a(e) {
		W.textToTranslate = e, W.translate();
	}
	function o(e, t) {
		(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), a(t));
	}
	function s(e) {
		W.reverseTranslation(e);
	}
	function c(e, t) {
		(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), s(t));
	}
	var u = Ji(), d = j(u), f = (e) => {
		var t = $m(), u = A(t), d = A(u);
		Ca(d, 21, () => W.translated.dict, ya, (e, t, u) => {
			var d = Qm(), f = j(d), p = A(f), m = A(p, !0);
			E(p);
			var h = M(p), g = (e) => {
				var t = qm(), n = A(t), r = A(n);
				r.nodeValue = `${l.i18n.getMessage("popup_dictionary_frequency") ?? ""} `, Km(M(r), { class: "size-4" }), E(n), E(t), I(e, t);
			};
			L(h, (e) => {
				u === 0 && e(g);
			}), E(f);
			var _ = M(f, 2);
			Ca(_, 17, () => P(t).entry, ya, (e, t, i, l) => {
				var u = Xm(), d = A(u), f = A(d);
				z(f, 1, R([
					"rounded-sm px-1.5 font-medium whitespace-nowrap transition-colors ease-effects-fast",
					"outline-color-secondary focus-visible:outline-common",
					"hover:bg-color-secondary-container hover:text-color-on-secondary-container"
				]));
				var p = A(f, !0);
				E(f), E(d);
				var m = M(d);
				Ca(m, 21, () => P(t).reverse_translation, ya, (e, t) => {
					var r = Jm(), i = A(r, !0);
					E(r), N(() => {
						z(r, 1, R([
							"inline-flex rounded-sm px-1.5 transition-colors ease-effects-fast",
							"outline-color-secondary focus-visible:outline-common",
							"hover:bg-color-secondary-container hover:text-color-on-secondary-container",
							P(n) === P(t) ? "bg-color-secondary-container text-color-on-secondary-container" : "bg-color-surface-container-high text-color-on-surface-variant"
						])), ia(i, P(t));
					}), Li("click", r, () => a(P(t))), Ii("keypress", r, (e) => o(e, P(t))), Ii("mouseenter", r, () => k(n, P(t), !0)), Ii("mouseleave", r, () => k(n, "")), I(e, r);
				}), E(m);
				var h = M(m), g = A(h);
				Ca(g, 21, () => r(P(t).score), ya, (e, t, n, r) => {
					var i = Ym();
					N(() => z(i, 1, R(["h-[6px] w-[12px]", P(t) ? "bg-color-tertiary" : "bg-color-surface-container-highest"]))), I(e, i);
				}), E(g), E(h), E(u), N(() => ia(p, P(t).word)), Li("click", f, () => s(P(t).word)), Ii("keypress", f, (e) => c(e, P(t).word)), I(e, u);
			});
			var v = M(_, 2), y = (e) => {
				I(e, Zm());
			}, b = /* @__PURE__ */ D(() => !i(W.translated.dict, u));
			L(v, (e) => {
				P(b) && e(y);
			}), N(() => ia(m, P(t).pos)), I(e, d);
		}), E(d), E(u), E(t), I(e, t);
	};
	L(d, (e) => {
		W.translated?.dict && e(f);
	}), I(e, u), qt();
}
Ri(["click"]);
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/PopupFooter/lib/Definitions.svelte
var th = /* @__PURE__ */ F("<span class=\"rounded-sm bg-color-surface-container-high px-1 py-0.5 text-xs font-medium uppercase\"> </span>"), nh = /* @__PURE__ */ F("<div class=\"mb-1 flex items-center gap-1\"></div>"), rh = /* @__PURE__ */ F("<br/> <span role=\"button\" tabindex=\"0\"> </span>", 1), ih = /* @__PURE__ */ F("<span class=\"ml-2 text-sm text-color-on-surface-variant italic\"> </span>"), ah = /* @__PURE__ */ F("<button type=\"button\"> </button>"), oh = /* @__PURE__ */ F("<!> <!>", 1), sh = /* @__PURE__ */ F("<div class=\"my-1 text-color-on-surface-variant\"></div> <!>", 1), ch = /* @__PURE__ */ F("<div class=\"flex gap-3\"><span></span> <li><!> <span role=\"button\" tabindex=\"0\"> </span> <!> <!></li></div>"), lh = /* @__PURE__ */ F("<div class=\"mb-3 last:mb-0\"><div class=\"mb-2 font-medium text-color-primary first-letter:uppercase\"> </div> <ul class=\"list-none space-y-3\"></ul></div>"), uh = /* @__PURE__ */ F("<div></div>");
function dh(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ D(() => r(W.translated));
	function r(e) {
		if (!e || !e.definitions) return;
		let { definitions: t, synsets: n } = Rt(e);
		if (!Object.hasOwn(e, "synsets")) return e.definitions;
		let r = {};
		for (let e of n) for (let t of e.entry) r[t.definition_id] = [...r[t.definition_id] || [], t];
		for (let e of t) for (let t of e.entry) r[t.definition_id] && (t.synsets = r[t.definition_id]);
		return t;
	}
	let i = (e) => e.sort((e, t) => e.label_info ? 1 : t.label_info ? -1 : 0);
	function a(e) {
		return Object.hasOwn(e, "subject") ? e.subject : Object.hasOwn(e, "register") ? e.register : [];
	}
	function o(e) {
		W.textToTranslate = e, W.translate();
	}
	function s(e, t) {
		(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), o(t));
	}
	var c = Ji(), u = j(c), d = (e) => {
		var t = uh();
		Ca(t, 21, () => P(n), ya, (e, t) => {
			var n = lh(), r = A(n), c = A(r, !0);
			E(r);
			var u = M(r, 2);
			Ca(u, 21, () => P(t).entry, ya, (e, t, n, r) => {
				let c = /* @__PURE__ */ D(() => P(t).label_info ? a(P(t).label_info) : []);
				var u = ch(), d = A(u);
				z(d, 1, R(["flex size-5 shrink-0 items-center justify-center rounded-full", "bg-color-surface-container-high text-color-on-surface-variant"])), d.textContent = n + 1;
				var f = M(d, 2), p = A(f), m = (e) => {
					var t = nh();
					Ca(t, 21, () => P(c), ya, (e, t, n, r) => {
						var i = th(), a = A(i, !0);
						E(i), N(() => ia(a, P(t))), I(e, i);
					}), E(t), I(e, t);
				};
				L(p, (e) => {
					P(c).length && e(m);
				});
				var h = M(p, 2);
				z(h, 1, R([
					"cursor-pointer rounded-xs text-color-on-surface",
					"hover:bg-color-secondary-container hover:text-color-on-secondary-container",
					"transition-colors ease-effects-fast",
					"outline-color-secondary focus-visible:outline-common"
				]));
				var g = A(h, !0);
				E(h);
				var _ = M(h, 2), v = (e) => {
					var n = rh(), r = M(j(n), 2);
					z(r, 1, R([
						"cursor-pointer rounded-xs text-color-on-surface-variant",
						"hover:bg-color-secondary-container hover:text-color-on-secondary-container",
						"transition-colors ease-effects-fast",
						"outline-color-secondary focus-visible:outline-common"
					]));
					var i = A(r);
					E(r), N(() => ia(i, `"${P(t).example ?? ""}"`)), Li("click", r, () => o(P(t).example)), Li("keydown", r, (e) => s(e, P(t).example)), I(e, n);
				};
				L(_, (e) => {
					P(t).example && e(v);
				});
				var y = M(_, 2), b = (e) => {
					var n = sh(), r = j(n);
					r.textContent = l.i18n.getMessage("popup_definitions_synonyms"), Ca(M(r, 2), 17, () => i(P(t).synsets), ya, (e, t, n, r) => {
						var i = oh(), l = j(i), u = (e) => {
							var n = Ji();
							Ca(j(n), 17, () => a(P(t).label_info), ya, (e, t, n, r) => {
								var i = Ji(), a = j(i), o = (e) => {
									var n = ih(), r = A(n);
									E(n), N(() => ia(r, `${P(t) ?? ""}:`)), I(e, n);
								}, s = /* @__PURE__ */ D(() => !P(c).includes(P(t)));
								L(a, (e) => {
									P(s) && e(o);
								}), I(e, i);
							}), I(e, n);
						};
						L(l, (e) => {
							P(t).label_info && e(u);
						}), Ca(M(l, 2), 17, () => P(t).synonym, ya, (e, t, n, r) => {
							var i = ah();
							z(i, 1, R([
								"mr-1 mb-1 inline rounded-sm px-1.5 transition-colors ease-effects-fast",
								"outline-color-secondary focus-visible:outline-common",
								"bg-color-surface-container-high text-color-on-surface-variant",
								"hover:bg-color-secondary-container hover:text-color-on-secondary-container"
							]));
							var a = A(i, !0);
							E(i), N(() => ia(a, P(t))), Li("click", i, () => o(P(t))), Ii("keypress", i, (e) => s(e, P(t))), I(e, i);
						}), I(e, i);
					}), I(e, n);
				};
				L(y, (e) => {
					P(t).synsets && e(b);
				}), E(f), E(u), N(() => ia(g, P(t).gloss)), Li("click", h, () => o(P(t).gloss)), Li("keydown", h, (e) => s(e, P(t).gloss)), I(e, u);
			}), E(u), E(n), N(() => ia(c, P(t).pos)), I(e, n);
		}), E(t), I(e, t);
	};
	L(u, (e) => {
		P(n) && e(d);
	}), I(e, c), qt();
}
Ri(["click", "keydown"]);
//#endregion
//#region ~icons/material-symbols/format-quote-rounded.svelte
var fh = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M6.55 16.5L8 14q-1.65 0-2.825-1.175T4 10t1.175-2.825T8 6t2.825 1.175T12 10q0 .575-.137 1.063T11.45 12l-3.175 5.5q-.125.225-.35.363t-.5.137q-.575 0-.862-.5t-.013-1m9 0L17 14q-1.65 0-2.825-1.175T13 10t1.175-2.825T17 6t2.825 1.175T21 10q0 .575-.137 1.063T20.45 12l-3.175 5.5q-.125.225-.35.363t-.5.137q-.575 0-.862-.5t-.013-1\"></path></svg>");
function ph(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = fh();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/utils/stripTags.ts
function mh(e) {
	let t = document.createElement("div");
	return t.innerHTML = e, t.textContent ?? "";
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/PopupFooter/lib/Examples.svelte
var hh = Eo(() => W), gh = /* @__PURE__ */ F("<div class=\"flex items-center gap-2\"><!> <li><span role=\"button\" tabindex=\"0\"></span></li></div>"), _h = /* @__PURE__ */ F("<div><ul class=\"flex list-inside list-none flex-col gap-2\"></ul></div>");
function vh(e, t) {
	Kt(t, !1);
	function n(e) {
		hh(hh().textToTranslate = mh(e)), hh().translate();
	}
	function r(e, t) {
		(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), n(t));
	}
	wo();
	var i = Ji(), a = j(i), o = (e) => {
		var t = _h(), i = A(t);
		Ca(i, 5, () => hh().translated?.examples?.example, ya, (e, t) => {
			var i = gh(), a = A(i);
			ph(a, { class: "size-5 shrink-0 self-start text-color-on-surface-variant" });
			var o = M(a, 2), s = A(o);
			z(s, 1, R([
				"cursor-pointer rounded-xs text-color-on-surface",
				"hover:bg-color-secondary-container hover:text-color-on-secondary-container",
				"transition-colors ease-effects-fast",
				"outline-color-secondary focus-visible:outline-common"
			])), ka(s, () => P(t).text, !0), E(s), E(o), E(i), Li("click", s, () => n(P(t).text)), Li("keydown", s, (e) => r(e, P(t).text)), I(e, i);
		}), E(i), E(t), I(e, t);
	};
	L(a, (e) => {
		hh().translated?.examples && e(o);
	}), I(e, i), qt();
}
Ri(["click", "keydown"]);
//#endregion
//#region ~icons/material-symbols/dictionary-outline-rounded.svelte
var yh = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M5.7 12.575h2.6l.475 1.325q.05.15.175.238t.3.087q.275 0 .438-.225t.062-.475l-2.05-5.4q-.05-.15-.187-.25t-.313-.1h-.4q-.175 0-.312.1t-.188.25l-2.05 5.4q-.1.25.063.475t.437.225q.175 0 .313-.087t.187-.263zm.325-.925l.95-2.675h.05l.95 2.675zM6.5 16q1.175 0 2.288.263T11 17.05V7.2q-1.025-.6-2.175-.9T6.5 6q-.9 0-1.788.175T3 6.7v9.9q.875-.3 1.738-.45T6.5 16m6.5 1.05q1.1-.525 2.213-.787T17.5 16q.9 0 1.763.15T21 16.6V6.7q-.825-.35-1.713-.525T17.5 6q-1.175 0-2.325.3T13 7.2zm-1.662 2.338q-.313-.088-.588-.238q-.975-.575-2.05-.862T6.5 18q-1.05 0-2.062.275T2.5 19.05q-.525.275-1.012-.025T1 18.15V6.1q0-.275.138-.525T1.55 5.2q1.15-.6 2.4-.9T6.5 4q1.45 0 2.838.375T12 5.5q1.275-.75 2.663-1.125T17.5 4q1.3 0 2.55.3t2.4.9q.275.125.413.375T23 6.1v12.05q0 .575-.487.875t-1.013.025q-.925-.5-1.937-.775T17.5 18q-1.125 0-2.2.288t-2.05.862q-.275.15-.587.238t-.663.087t-.663-.088M14 8.776q0-.225.163-.462T14.525 8q.725-.25 1.45-.375T17.5 7.5q.5 0 .988.063t.962.162q.225.05.388.25t.162.45q0 .425-.275.625t-.7.1q-.35-.075-.737-.112T17.5 9q-.65 0-1.275.125t-1.2.325q-.45.175-.737-.025T14 8.775m0 5.5q0-.225.163-.462t.362-.313q.725-.25 1.45-.375T17.5 13q.5 0 .988.063t.962.162q.225.05.388.25t.162.45q0 .425-.275.625t-.7.1q-.35-.075-.737-.112T17.5 14.5q-.65 0-1.275.113t-1.2.312q-.45.175-.737-.012T14 14.275m0-2.75q0-.225.163-.462t.362-.313q.725-.25 1.45-.375t1.525-.125q.5 0 .988.063t.962.162q.225.05.388.25t.162.45q0 .425-.275.625t-.7.1q-.35-.075-.737-.112t-.788-.038q-.65 0-1.275.125t-1.2.325q-.45.175-.737-.025t-.288-.65\"></path></svg>");
function bh(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = yh();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/dictionary-rounded.svelte
var xh = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"m6.025 11.65l.95-2.675h.05l.95 2.675zM13 17.05q1.1-.525 2.213-.788T17.5 16q.9 0 1.763.15T21 16.6V6.7q-.825-.35-1.713-.525T17.5 6q-1.175 0-2.325.3T13 7.2zm-7.3-4.475h2.6l.475 1.325q.05.15.175.238t.3.087q.275 0 .438-.225t.062-.475l-2.05-5.4q-.05-.15-.187-.25t-.313-.1h-.4q-.175 0-.312.1t-.188.25l-2.05 5.4q-.1.25.063.475t.437.225q.175 0 .313-.087t.187-.263zm5.638 6.813q-.313-.088-.588-.238q-.975-.575-2.05-.862T6.5 18q-1.05 0-2.062.275T2.5 19.05q-.525.275-1.012-.025T1 18.15V6.1q0-.275.138-.525T1.55 5.2q1.175-.575 2.413-.888T6.5 4q1.45 0 2.838.375T12 5.5q1.275-.75 2.663-1.125T17.5 4q1.3 0 2.538.313t2.412.887q.275.125.413.375T23 6.1v12.05q0 .575-.487.875t-1.013.025q-.925-.5-1.937-.775T17.5 18q-1.125 0-2.2.288t-2.05.862q-.275.15-.587.238t-.663.087t-.663-.088M14 8.776q0-.225.163-.462T14.525 8q.725-.25 1.45-.375T17.5 7.5q.5 0 .988.063t.962.162q.225.05.388.25t.162.45q0 .425-.275.625t-.7.1q-.35-.075-.737-.112T17.5 9q-.65 0-1.275.125t-1.2.325q-.45.175-.737-.025T14 8.775m0 5.5q0-.225.163-.462t.362-.313q.725-.25 1.45-.375T17.5 13q.5 0 .988.063t.962.162q.225.05.388.25t.162.45q0 .425-.275.625t-.7.1q-.35-.075-.737-.112T17.5 14.5q-.65 0-1.275.113t-1.2.312q-.45.175-.737-.012T14 14.275m0-2.75q0-.225.163-.462t.362-.313q.725-.25 1.45-.375t1.525-.125q.5 0 .988.063t.962.162q.225.05.388.25t.162.45q0 .425-.275.625t-.7.1q-.35-.075-.737-.112t-.788-.038q-.65 0-1.275.125t-1.2.325q-.45.175-.737-.025t-.288-.65\"></path></svg>");
function Sh(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = xh();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/text-snippet-outline-rounded.svelte
var Ch = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M5 19h14V9.825L14.175 5H5zm0 2q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h9.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V19q0 .825-.587 1.413T19 21zm3-4h8q.425 0 .713-.288T17 16t-.288-.712T16 15H8q-.425 0-.712.288T7 16t.288.713T8 17m0-4h8q.425 0 .713-.288T17 12t-.288-.712T16 11H8q-.425 0-.712.288T7 12t.288.713T8 13m0-4h5q.425 0 .713-.288T14 8t-.288-.712T13 7H8q-.425 0-.712.288T7 8t.288.713T8 9M5 19V5z\"></path></svg>");
function wh(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Ch();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/text-snippet-rounded.svelte
var Th = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h9.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V19q0 .825-.587 1.413T19 21zm3-4h8q.425 0 .713-.288T17 16t-.288-.712T16 15H8q-.425 0-.712.288T7 16t.288.713T8 17m0-4h8q.425 0 .713-.288T17 12t-.288-.712T16 11H8q-.425 0-.712.288T7 12t.288.713T8 13m0-4h5q.425 0 .713-.288T14 8t-.288-.712T13 7H8q-.425 0-.712.288T7 8t.288.713T8 9\"></path></svg>");
function Eh(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Th();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region ~icons/material-symbols/format-quote-outline-rounded.svelte
var Dh = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M6.55 16.5L8 14q-1.65 0-2.825-1.175T4 10t1.175-2.825T8 6t2.825 1.175T12 10q0 .575-.137 1.063T11.45 12l-3.175 5.5q-.125.225-.35.363t-.5.137q-.575 0-.862-.5t-.013-1m9 0L17 14q-1.65 0-2.825-1.175T13 10t1.175-2.825T17 6t2.825 1.175T21 10q0 .575-.137 1.063T20.45 12l-3.175 5.5q-.125.225-.35.363t-.5.137q-.575 0-.862-.5t-.013-1m-6.488-5.437Q9.5 10.625 9.5 10t-.437-1.062T8 8.5t-1.062.438T6.5 10t.438 1.063T8 11.5t1.063-.437m9 0q.437-.438.437-1.063t-.437-1.062T17 8.5t-1.062.438T15.5 10t.438 1.063T17 11.5t1.063-.437M8 10\"></path></svg>");
function Oh(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Dh();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/PopupFull/lib/PopupFooter/PopupFooter.svelte
var kh = /* @__PURE__ */ F("<div><!></div>"), Ah = /* @__PURE__ */ F("<footer class=\"pointer-events-none absolute inset-x-0 top-full -mt-1 flex min-h-0 flex-col items-center justify-center gap-1 px-2\"><div></div> <!></footer>");
function jh(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ O(0), r = /* @__PURE__ */ D(() => U.motionDisabled ? 0 : 350), i = /* @__PURE__ */ D(() => U.motionDisabled ? 0 : 250), a = [
		{
			id: 0,
			srcKey: "",
			label: "",
			Icon: void 0,
			IconActive: void 0,
			component: void 0
		},
		{
			id: 1,
			srcKey: "dict",
			label: l.i18n.getMessage("popup_dictionary"),
			Icon: bh,
			IconActive: Sh,
			component: eh
		},
		{
			id: 2,
			srcKey: "definitions",
			label: l.i18n.getMessage("popup_definitions"),
			Icon: wh,
			IconActive: Eh,
			component: dh
		},
		{
			id: 3,
			srcKey: "examples",
			label: l.i18n.getMessage("popup_examples"),
			Icon: Oh,
			IconActive: ph,
			component: vh
		}
	], o = /* @__PURE__ */ D(() => a.find((e) => e.id === P(n))?.component), s = (e) => {
		k(n, P(n) === e ? 0 : e, !0);
	};
	var c = Ji(), u = j(c), d = (e) => {
		var t = Ah(), c = A(t);
		Ca(c, 21, () => a, (e) => e.id, (e, t) => {
			var r = Ji(), i = j(r), a = (e) => {
				let r = /* @__PURE__ */ D(() => P(n) === P(t).id);
				gm(e, {
					class: ["rounded-sm first:rounded-l-2xl last:rounded-r-2xl aria-pressed:rounded-2xl", "aria-pressed:active:rounded-xs aria-pressed:active:first:rounded-l-2xl aria-pressed:active:last:rounded-r-2xl"],
					get label() {
						return P(t).label;
					},
					onclick: () => s(P(t).id),
					get selected() {
						return P(r);
					},
					size: "xs",
					toggle: !0,
					leadingIcon: (e) => {
						var n = Ji();
						Aa(j(n), () => P(t).Icon, (e, t) => {
							t(e, {});
						}), I(e, n);
					},
					selectedIcon: (e) => {
						var n = Ji();
						Aa(j(n), () => P(t).IconActive, (e, t) => {
							t(e, {});
						}), I(e, n);
					},
					$$slots: {
						leadingIcon: !0,
						selectedIcon: !0
					}
				});
			}, o = /* @__PURE__ */ D(() => P(t).component && Object.hasOwn(W.translated, P(t).srcKey));
			L(i, (e) => {
				P(o) && e(a);
			}), I(e, r);
		}), E(c);
		var l = M(c, 2), u = (e) => {
			var t = kh();
			Aa(A(t), () => P(o), (e, t) => {
				t(e, {});
			}), E(t), N(() => z(t, 1, R([
				"pointer-events-auto flex w-full flex-col overflow-hidden rounded-xl",
				"bg-color-surface-bright text-sm text-color-on-surface",
				"*:scrollbar *:max-h-96 *:overflow-y-auto *:px-2 *:py-1.5",
				Xu.dragging ? "shadow-lg" : "shadow-md"
			]))), Va(1, t, () => us, () => ({
				y: -20,
				duration: P(r),
				easing: ud
			})), Va(2, t, () => us, () => ({
				y: -20,
				duration: P(i)
			})), I(e, t);
		};
		L(l, (e) => {
			P(o) && e(u);
		}), E(t), N(() => z(c, 1, R([
			"flex items-center gap-0.5 rounded-full p-1",
			"pointer-events-auto bg-color-surface-bright",
			Xu.dragging ? "shadow-lg" : "shadow-md"
		]))), I(e, t);
	};
	L(u, (e) => {
		W.translated && W.showFooter && e(d);
	}), I(e, c), qt();
}
//#endregion
//#region src/entrypoints/content/utils/drag.ts
function Mh(e = {}) {
	let { threshold: t = 6, onStart: n, onMove: r, onEnd: i } = e;
	return (e) => {
		let a = !1, o = 0, s = 0, c = (e) => {
			a &&= (e.stopPropagation(), !1);
		}, l = (c) => {
			if (c.button !== 0) return;
			let l = c.clientX, u = c.clientY, { top: d } = e.getBoundingClientRect(), f = !1, p = (i) => {
				e.style.cursor = "grabbing", o = i.clientX - l, s = Math.max(-d, i.clientY - u), !(!f && Math.hypot(o, s) < t) && (f || (f = !0, a = !0, n?.({
					dx: 0,
					dy: 0
				})), r?.({
					dx: o,
					dy: s
				}));
			}, m = () => {
				window.removeEventListener("pointermove", p), window.removeEventListener("pointerup", m), f && i?.({
					dx: o,
					dy: s
				}), e.style.cursor = "grab";
			};
			window.addEventListener("pointermove", p), window.addEventListener("pointerup", m);
		};
		return e.addEventListener("click", c, { capture: !0 }), e.addEventListener("pointerdown", l), e.style.cursor = "grab", () => {
			e.removeEventListener("click", c, { capture: !0 }), e.removeEventListener("pointerdown", l);
		};
	};
}
//#endregion
//#region src/entrypoints/content/utils/resize.ts
var Nh = {
	n: "ns-resize",
	s: "ns-resize",
	e: "ew-resize",
	w: "ew-resize",
	ne: "nesw-resize",
	sw: "nesw-resize",
	nw: "nwse-resize",
	se: "nwse-resize"
};
function Ph(e = {}) {
	return (t) => {
		let { margin: n = 8, minWidth: r = 40, minHeight: i = 40, cursorContainer: a, onStart: o, onMove: s, onEnd: c } = e, l = e.handleElem ?? t, u = t.ownerDocument, d = (a ? u.querySelector(a) : t) ?? u.body, f = !1, p = null, m = {
			x: 0,
			y: 0
		}, h = {
			left: 0,
			top: 0,
			width: 0,
			height: 0
		};
		function g(e) {
			let t = l.getBoundingClientRect(), r = t.right - e.clientX, i = e.clientX - t.left, a = t.bottom - e.clientY, o = e.clientY - t.top, s = "", c = "";
			return o < n ? s = "n" : a < n && (s = "s"), i < n ? c = "w" : r < n && (c = "e"), !s && !c ? null : s + c;
		}
		function _(e, n) {
			return {
				direction: p,
				dx: e,
				dy: n,
				width: t.offsetWidth,
				height: t.offsetHeight,
				x: parseFloat(t.style.left) || 0,
				y: parseFloat(t.style.top) || 0
			};
		}
		function v(e, n) {
			let a = p, { left: o, top: s, width: c, height: l } = h, d = u.documentElement, f = d.clientWidth, m = d.clientHeight;
			if (a.includes("e") && (c = Math.max(r, c + e), c = Math.min(c, f - o)), a.includes("s") && (l = Math.max(i, l + n), l = Math.min(l, m - s)), a.includes("w")) {
				let t = Math.max(r, c - e), n = Math.max(0, o + (c - t));
				c = o + c - n, o = n;
			}
			if (a.includes("n")) {
				let e = Math.max(i, l - n), t = Math.max(0, s + (l - e));
				l = s + l - t, s = t;
			}
			t.style.left = `${o}px`, t.style.top = `${s}px`, t.style.width = `${c}px`, t.style.height = `${l}px`;
		}
		function y(e) {
			if (f) {
				let t = e.clientX - m.x, n = e.clientY - m.y;
				v(t, n), s?.(_(t, n));
				return;
			}
			if (e.target !== l) {
				l.style.cursor = "";
				return;
			}
			let t = g(e);
			l.style.cursor = t ? Nh[t] : "";
		}
		function b(e) {
			if (e.target instanceof HTMLElement && e.target !== l) return;
			let n = g(e);
			n && (p = n, f = !0, m = {
				x: e.clientX,
				y: e.clientY
			}, h = {
				left: parseFloat(t.style.left) || 0,
				top: parseFloat(t.style.top) || 0,
				width: t.offsetWidth,
				height: t.offsetHeight
			}, l.setPointerCapture(e.pointerId), d.style.cursor = Nh[n], o?.(_(0, 0)));
		}
		function x(e) {
			f && (f = !1, d.style.cursor = "", c?.(_(e.clientX - m.x, e.clientY - m.y)), p = null);
		}
		return l.addEventListener("pointermove", y), l.addEventListener("pointerdown", b), l.addEventListener("pointerup", x), () => {
			l.removeEventListener("pointermove", y), l.removeEventListener("pointerdown", b), l.removeEventListener("pointerup", x);
		};
	};
}
//#endregion
//#region ~icons/material-symbols/open-in-full-rounded.svelte
var Fh = /* @__PURE__ */ Ki("<svg><path fill=\"currentColor\" d=\"M4 21q-.425 0-.712-.288T3 20v-6q0-.425.288-.712T4 13t.713.288T5 14v3.6L17.6 5H14q-.425 0-.712-.288T13 4t.288-.712T14 3h6q.425 0 .713.288T21 4v6q0 .425-.288.713T20 11t-.712-.288T19 10V6.4L6.4 19H10q.425 0 .713.288T11 20t-.288.713T10 21z\"></path></svg>");
function Ih(e, t) {
	let n = /* @__PURE__ */ V(t, [
		"$$slots",
		"$$events",
		"$$legacy"
	]);
	var r = Fh();
	B(r, () => ({
		viewBox: "0 0 24 24",
		...n
	})), I(e, r);
}
//#endregion
//#region src/entrypoints/content/lib/Popup.svelte
var Lh = /* @__PURE__ */ F("<div><div class=\"flex size-full min-h-0 p-2\"><div><header class=\"flex shrink-0 items-center justify-between gap-1 p-1\"><div class=\"flex items-center gap-1\"><!> <!></div> <div class=\"flex items-center gap-1\"><!> <!></div></header> <!></div></div> <!></div>");
function Rh(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ O(20), r = /* @__PURE__ */ O(20), i = /* @__PURE__ */ O(0), a = /* @__PURE__ */ O(0), o = /* @__PURE__ */ O(null), s = /* @__PURE__ */ O(null), c = /* @__PURE__ */ D(() => ({ getBoundingClientRect: () => W.selectedElemRect || new DOMRect(20, 20, 0, 0) })), u = /* @__PURE__ */ D(() => U.motionDisabled ? 0 : 300), d = /* @__PURE__ */ D(() => U.settings.popupMode === No.Full), f = /* @__PURE__ */ D(() => U.settings.popupLayout === Po.Horiz), p = /* @__PURE__ */ D(() => P(d) ? 540 : 280), m = /* @__PURE__ */ D(() => P(d) ? P(f) ? 540 : 400 : 280), h = /* @__PURE__ */ D(() => P(d) ? P(f) ? 160 : 256 : U.settings.simpleModeShowLangs ? 140 : 100), g = (e) => {
		qc(P(c), e, {
			strategy: "fixed",
			placement: "bottom-start",
			middleware: [
				Wc(-4),
				Kc({ flipAlignment: !1 }),
				Gc({ padding: 10 })
			]
		}).then(({ x: e, y: t }) => {
			let { innerWidth: i, innerHeight: a } = window;
			(e < 0 || e > i) && (e = 10), (t < 0 || t > a) && (t = 10), k(n, e, !0), k(r, t, !0);
		});
	};
	function _() {
		U.settings.lockWindow || (W.showPopup = !1);
	}
	function v() {
		U.settings.popupMode = No.Full;
	}
	function y() {
		W.showPopup = !1;
	}
	function b() {
		let e = Oi(() => P(p));
		return e < P(m) ? P(m) : e;
	}
	jr(() => {
		P(o) && (P(o).style.height = "", P(o).style.width = `${b()}px`);
	}), pa(() => {
		W.resetTranslateStore();
	});
	var x = Lh();
	let ee;
	var S = A(x), C = A(S), te = A(C), ne = A(te), re = A(ne);
	uf(re, {});
	var ie = M(re, 2), ae = (e) => {
		jf(e, {});
	};
	L(ie, (e) => {
		P(d) && e(ae);
	}), E(ne);
	var oe = M(ne, 2), se = A(oe), ce = (e) => {
		rf(e, {});
	}, le = (e) => {
		ed(e, {
			color: "standard",
			onclick: v,
			size: "xs",
			title: l.i18n.getMessage("popup_menu_switch_to_full_mode"),
			children: (e, t) => {
				Ih(e, {});
			},
			$$slots: { default: !0 }
		});
	};
	L(se, (e) => {
		P(d) ? e(ce) : e(le, -1);
	}), ed(M(se, 2), {
		color: "standard",
		onclick: y,
		size: "xs",
		title: "Close",
		children: (e, t) => {
			Ff(e, {});
		},
		$$slots: { default: !0 }
	}), E(oe), E(te), Wa(te, () => Mh({
		onStart: () => {
			Xu.dragging = !0;
		},
		onMove: (e) => {
			k(i, e.dx, !0), k(a, e.dy, !0);
		},
		onEnd: (e) => {
			k(n, P(n) + e.dx), k(r, P(r) + e.dy), k(i, 0), k(a, 0), Xu.dragging = !1;
		}
	}));
	var ue = M(te, 2), de = (e) => {
		Fm(e, {});
	}, w = (e) => {
		Wm(e, {});
	};
	L(ue, (e) => {
		P(d) ? e(de) : e(w, -1);
	}), E(C), E(S), Co(S, (e) => k(s, e), () => P(s));
	var fe = M(S, 2), pe = (e) => {
		jh(e, {});
	};
	L(fe, (e) => {
		P(d) && e(pe);
	}), E(x), Co(x, (e) => k(o, e), () => P(o)), Wa(x, () => Ph({
		handleElem: P(s),
		margin: 10,
		minWidth: P(m),
		minHeight: P(h),
		cursorContainer: me,
		onStart: () => {
			Xu.resizing = !0;
		},
		onEnd: (e) => {
			k(n, e.x, !0), k(r, e.y, !0), k(p, e.width), Xu.resizing = !1;
		}
	})), Ua(x, (e) => kd?.(e)), Ua(x, (e) => g?.(e)), N(() => {
		z(x, 1, R(["fixed z-999999999 flex size-fit max-h-[calc(100vh-40px)] min-h-0 flex-col", Xu.dragging || Xu.resizing && "select-none"])), ee = $a(x, "", ee, {
			left: `${P(n) ?? ""}px`,
			top: `${P(r) ?? ""}px`,
			width: `${P(p) ?? ""}px`,
			transform: `translate(${P(i) ?? ""}px, ${P(a) ?? ""}px)`
		}), z(C, 1, R(["flex min-h-0 w-full flex-col rounded-xl bg-color-surface-container transition-shadow ease-effects-fast", Xu.dragging ? "shadow-lg" : "shadow-md"]));
	}), Ii("clickoutside", x, _), Va(1, x, () => ls, () => ({
		duration: P(u),
		easing: ld
	})), I(e, x), qt();
}
//#endregion
//#region src/entrypoints/content/utils/index.ts
var zh = (e) => e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement, Bh = (e) => {
	if (zh(e)) {
		let { selectionStart: t, selectionEnd: n, value: r } = e;
		return t === null || n === null ? "" : r.substring(t, n).trim();
	}
	return document.getSelection()?.toString().trim() || "";
}, Vh = (e = document.activeElement) => {
	if (!e) return null;
	if (zh(e)) return DOMRect.fromRect(e.getBoundingClientRect());
	let t = document.getSelection();
	return !t?.rangeCount || !t.toString() ? null : DOMRect.fromRect(t.getRangeAt(0).getBoundingClientRect());
}, Hh = (e) => {
	if (zh(e)) return DOMRect.fromRect(e.getBoundingClientRect());
	let t = document.getSelection();
	if (!t?.rangeCount || t.isCollapsed) return null;
	let n = t.getRangeAt(0).cloneRange(), r = n.getClientRects();
	if (!r.length) return null;
	let i = r[r.length - 1];
	n.collapse(!1);
	let a = n.getClientRects();
	return DOMRect.fromRect(a.length > 0 ? n.getBoundingClientRect() : i);
};
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/utils/math_utils.js
function Uh(e) {
	return e < 0 ? -1 : e === 0 ? 0 : 1;
}
function Wh(e, t, n) {
	return (1 - n) * e + n * t;
}
function Gh(e, t, n) {
	return n < e ? e : n > t ? t : n;
}
function Kh(e, t, n) {
	return n < e ? e : n > t ? t : n;
}
function qh(e) {
	return e %= 360, e < 0 && (e += 360), e;
}
function Jh(e) {
	return e %= 360, e < 0 && (e += 360), e;
}
function Yh(e, t) {
	return 180 - Math.abs(Math.abs(e - t) - 180);
}
function Xh(e, t) {
	return [
		e[0] * t[0][0] + e[1] * t[0][1] + e[2] * t[0][2],
		e[0] * t[1][0] + e[1] * t[1][1] + e[2] * t[1][2],
		e[0] * t[2][0] + e[1] * t[2][1] + e[2] * t[2][2]
	];
}
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/utils/color_utils.js
var Zh = [
	[
		.41233895,
		.35762064,
		.18051042
	],
	[
		.2126,
		.7152,
		.0722
	],
	[
		.01932141,
		.11916382,
		.95034478
	]
], Qh = [
	[
		3.2413774792388685,
		-1.5376652402851851,
		-.49885366846268053
	],
	[
		-.9691452513005321,
		1.8758853451067872,
		.04156585616912061
	],
	[
		.05562093689691305,
		-.20395524564742123,
		1.0571799111220335
	]
], $h = [
	95.047,
	100,
	108.883
];
function eg(e, t, n) {
	return (255 << 24 | (e & 255) << 16 | (t & 255) << 8 | n & 255) >>> 0;
}
function tg(e) {
	return eg(pg(e[0]), pg(e[1]), pg(e[2]));
}
function ng(e) {
	return e >> 16 & 255;
}
function rg(e) {
	return e >> 8 & 255;
}
function ig(e) {
	return e & 255;
}
function ag(e, t, n) {
	let r = Qh, i = r[0][0] * e + r[0][1] * t + r[0][2] * n, a = r[1][0] * e + r[1][1] * t + r[1][2] * n, o = r[2][0] * e + r[2][1] * t + r[2][2] * n;
	return eg(pg(i), pg(a), pg(o));
}
function og(e) {
	return Xh([
		fg(ng(e)),
		fg(rg(e)),
		fg(ig(e))
	], Zh);
}
function sg(e) {
	let t = fg(ng(e)), n = fg(rg(e)), r = fg(ig(e)), i = Zh, a = i[0][0] * t + i[0][1] * n + i[0][2] * r, o = i[1][0] * t + i[1][1] * n + i[1][2] * r, s = i[2][0] * t + i[2][1] * n + i[2][2] * r, c = $h, l = a / c[0], u = o / c[1], d = s / c[2], f = hg(l), p = hg(u), m = hg(d);
	return [
		116 * p - 16,
		500 * (f - p),
		200 * (p - m)
	];
}
function cg(e) {
	let t = pg(ug(e));
	return eg(t, t, t);
}
function lg(e) {
	let t = og(e)[1];
	return 116 * hg(t / 100) - 16;
}
function ug(e) {
	return 100 * gg((e + 16) / 116);
}
function dg(e) {
	return hg(e / 100) * 116 - 16;
}
function fg(e) {
	let t = e / 255;
	return t <= .040449936 ? t / 12.92 * 100 : ((t + .055) / 1.055) ** 2.4 * 100;
}
function pg(e) {
	let t = e / 100, n = 0;
	return n = t <= .0031308 ? t * 12.92 : 1.055 * t ** (1 / 2.4) - .055, Gh(0, 255, Math.round(n * 255));
}
function mg() {
	return $h;
}
function hg(e) {
	return e > .008856451679035631 ? e ** (1 / 3) : (903.2962962962963 * e + 16) / 116;
}
function gg(e) {
	let t = e * e * e;
	return t > .008856451679035631 ? t : (116 * e - 16) / 903.2962962962963;
}
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/hct/viewing_conditions.js
var _g = class e {
	static make(t = mg(), n = 200 / Math.PI * ug(50) / 100, r = 50, i = 2, a = !1) {
		let o = t, s = o[0] * .401288 + o[1] * .650173 + o[2] * -.051461, c = o[0] * -.250268 + o[1] * 1.204414 + o[2] * .045854, l = o[0] * -.002079 + o[1] * .048952 + o[2] * .953127, u = .8 + i / 10, d = u >= .9 ? Wh(.59, .69, (u - .9) * 10) : Wh(.525, .59, (u - .8) * 10), f = a ? 1 : u * (1 - 1 / 3.6 * Math.exp((-n - 42) / 92));
		f = f > 1 ? 1 : f < 0 ? 0 : f;
		let p = u, m = [
			100 / s * f + 1 - f,
			100 / c * f + 1 - f,
			100 / l * f + 1 - f
		], h = 1 / (5 * n + 1), g = h * h * h * h, _ = 1 - g, v = g * n + .1 * _ * _ * Math.cbrt(5 * n), y = ug(r) / t[1], b = 1.48 + Math.sqrt(y), x = .725 / y ** .2, ee = x, S = [
			(v * m[0] * s / 100) ** .42,
			(v * m[1] * c / 100) ** .42,
			(v * m[2] * l / 100) ** .42
		], C = [
			400 * S[0] / (S[0] + 27.13),
			400 * S[1] / (S[1] + 27.13),
			400 * S[2] / (S[2] + 27.13)
		];
		return new e(y, (2 * C[0] + C[1] + .05 * C[2]) * x, x, ee, d, p, m, v, v ** .25, b);
	}
	constructor(e, t, n, r, i, a, o, s, c, l) {
		this.n = e, this.aw = t, this.nbb = n, this.ncb = r, this.c = i, this.nc = a, this.rgbD = o, this.fl = s, this.fLRoot = c, this.z = l;
	}
};
_g.DEFAULT = _g.make();
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/hct/cam16.js
var vg = class e {
	constructor(e, t, n, r, i, a, o, s, c) {
		this.hue = e, this.chroma = t, this.j = n, this.q = r, this.m = i, this.s = a, this.jstar = o, this.astar = s, this.bstar = c;
	}
	distance(e) {
		let t = this.jstar - e.jstar, n = this.astar - e.astar, r = this.bstar - e.bstar;
		return 1.41 * Math.sqrt(t * t + n * n + r * r) ** .63;
	}
	static fromInt(t) {
		return e.fromIntInViewingConditions(t, _g.DEFAULT);
	}
	static fromIntInViewingConditions(t, n) {
		let r = (t & 16711680) >> 16, i = (t & 65280) >> 8, a = t & 255, o = fg(r), s = fg(i), c = fg(a), l = .41233895 * o + .35762064 * s + .18051042 * c, u = .2126 * o + .7152 * s + .0722 * c, d = .01932141 * o + .11916382 * s + .95034478 * c, f = .401288 * l + .650173 * u - .051461 * d, p = -.250268 * l + 1.204414 * u + .045854 * d, m = -.002079 * l + .048952 * u + .953127 * d, h = n.rgbD[0] * f, g = n.rgbD[1] * p, _ = n.rgbD[2] * m, v = (n.fl * Math.abs(h) / 100) ** .42, y = (n.fl * Math.abs(g) / 100) ** .42, b = (n.fl * Math.abs(_) / 100) ** .42, x = Uh(h) * 400 * v / (v + 27.13), ee = Uh(g) * 400 * y / (y + 27.13), S = Uh(_) * 400 * b / (b + 27.13), C = (11 * x + -12 * ee + S) / 11, te = (x + ee - 2 * S) / 9, ne = (20 * x + 20 * ee + 21 * S) / 20, re = (40 * x + 20 * ee + S) / 20, ie = Jh(Math.atan2(te, C) * 180 / Math.PI), ae = ie * Math.PI / 180, oe = 100 * (re * n.nbb / n.aw) ** +(n.c * n.z), se = 4 / n.c * Math.sqrt(oe / 100) * (n.aw + 4) * n.fLRoot, ce = ie < 20.14 ? ie + 360 : ie, le = (5e4 / 13 * (.25 * (Math.cos(ce * Math.PI / 180 + 2) + 3.8)) * n.nc * n.ncb * Math.sqrt(C * C + te * te) / (ne + .305)) ** .9 * (1.64 - .29 ** n.n) ** .73, ue = le * Math.sqrt(oe / 100), de = ue * n.fLRoot, w = 50 * Math.sqrt(le * n.c / (n.aw + 4)), fe = 1.7000000000000002 * oe / (1 + .007 * oe), pe = 1 / .0228 * Math.log(1 + .0228 * de);
		return new e(ie, ue, oe, se, de, w, fe, pe * Math.cos(ae), pe * Math.sin(ae));
	}
	static fromJch(t, n, r) {
		return e.fromJchInViewingConditions(t, n, r, _g.DEFAULT);
	}
	static fromJchInViewingConditions(t, n, r, i) {
		let a = 4 / i.c * Math.sqrt(t / 100) * (i.aw + 4) * i.fLRoot, o = n * i.fLRoot, s = n / Math.sqrt(t / 100), c = 50 * Math.sqrt(s * i.c / (i.aw + 4)), l = r * Math.PI / 180, u = 1.7000000000000002 * t / (1 + .007 * t), d = 1 / .0228 * Math.log(1 + .0228 * o);
		return new e(r, n, t, a, o, c, u, d * Math.cos(l), d * Math.sin(l));
	}
	static fromUcs(t, n, r) {
		return e.fromUcsInViewingConditions(t, n, r, _g.DEFAULT);
	}
	static fromUcsInViewingConditions(t, n, r, i) {
		let a = n, o = r, s = Math.sqrt(a * a + o * o), c = (Math.exp(s * .0228) - 1) / .0228 / i.fLRoot, l = 180 / Math.PI * Math.atan2(o, a);
		l < 0 && (l += 360);
		let u = t / (1 - (t - 100) * .007);
		return e.fromJchInViewingConditions(u, c, l, i);
	}
	toInt() {
		return this.viewed(_g.DEFAULT);
	}
	viewed(e) {
		let t = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** e.n) ** .73) ** (1 / .9), n = this.hue * Math.PI / 180, r = .25 * (Math.cos(n + 2) + 3.8), i = e.aw * (this.j / 100) ** (1 / e.c / e.z), a = 5e4 / 13 * r * e.nc * e.ncb, o = i / e.nbb, s = Math.sin(n), c = Math.cos(n), l = 23 * (o + .305) * t / (23 * a + 11 * t * c + 108 * t * s), u = l * c, d = l * s, f = (460 * o + 451 * u + 288 * d) / 1403, p = (460 * o - 891 * u - 261 * d) / 1403, m = (460 * o - 220 * u - 6300 * d) / 1403, h = Math.max(0, 27.13 * Math.abs(f) / (400 - Math.abs(f))), g = Uh(f) * (100 / e.fl) * h ** (1 / .42), _ = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), v = Uh(p) * (100 / e.fl) * _ ** (1 / .42), y = Math.max(0, 27.13 * Math.abs(m) / (400 - Math.abs(m))), b = Uh(m) * (100 / e.fl) * y ** (1 / .42), x = g / e.rgbD[0], ee = v / e.rgbD[1], S = b / e.rgbD[2];
		return ag(1.86206786 * x - 1.01125463 * ee + .14918677 * S, .38752654 * x + .62144744 * ee - .00897398 * S, -.0158415 * x - .03412294 * ee + 1.04996444 * S);
	}
	static fromXyzInViewingConditions(t, n, r, i) {
		let a = .401288 * t + .650173 * n - .051461 * r, o = -.250268 * t + 1.204414 * n + .045854 * r, s = -.002079 * t + .048952 * n + .953127 * r, c = i.rgbD[0] * a, l = i.rgbD[1] * o, u = i.rgbD[2] * s, d = (i.fl * Math.abs(c) / 100) ** .42, f = (i.fl * Math.abs(l) / 100) ** .42, p = (i.fl * Math.abs(u) / 100) ** .42, m = Uh(c) * 400 * d / (d + 27.13), h = Uh(l) * 400 * f / (f + 27.13), g = Uh(u) * 400 * p / (p + 27.13), _ = (11 * m + -12 * h + g) / 11, v = (m + h - 2 * g) / 9, y = (20 * m + 20 * h + 21 * g) / 20, b = (40 * m + 20 * h + g) / 20, x = Math.atan2(v, _) * 180 / Math.PI, ee = x < 0 ? x + 360 : x >= 360 ? x - 360 : x, S = ee * Math.PI / 180, C = 100 * (b * i.nbb / i.aw) ** +(i.c * i.z), te = 4 / i.c * Math.sqrt(C / 100) * (i.aw + 4) * i.fLRoot, ne = ee < 20.14 ? ee + 360 : ee, re = (5e4 / 13 * (1 / 4 * (Math.cos(ne * Math.PI / 180 + 2) + 3.8)) * i.nc * i.ncb * Math.sqrt(_ * _ + v * v) / (y + .305)) ** .9 * (1.64 - .29 ** i.n) ** .73, ie = re * Math.sqrt(C / 100), ae = ie * i.fLRoot, oe = 50 * Math.sqrt(re * i.c / (i.aw + 4)), se = 1.7000000000000002 * C / (1 + .007 * C), ce = Math.log(1 + .0228 * ae) / .0228;
		return new e(ee, ie, C, te, ae, oe, se, ce * Math.cos(S), ce * Math.sin(S));
	}
	xyzInViewingConditions(e) {
		let t = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** e.n) ** .73) ** (1 / .9), n = this.hue * Math.PI / 180, r = .25 * (Math.cos(n + 2) + 3.8), i = e.aw * (this.j / 100) ** (1 / e.c / e.z), a = 5e4 / 13 * r * e.nc * e.ncb, o = i / e.nbb, s = Math.sin(n), c = Math.cos(n), l = 23 * (o + .305) * t / (23 * a + 11 * t * c + 108 * t * s), u = l * c, d = l * s, f = (460 * o + 451 * u + 288 * d) / 1403, p = (460 * o - 891 * u - 261 * d) / 1403, m = (460 * o - 220 * u - 6300 * d) / 1403, h = Math.max(0, 27.13 * Math.abs(f) / (400 - Math.abs(f))), g = Uh(f) * (100 / e.fl) * h ** (1 / .42), _ = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), v = Uh(p) * (100 / e.fl) * _ ** (1 / .42), y = Math.max(0, 27.13 * Math.abs(m) / (400 - Math.abs(m))), b = Uh(m) * (100 / e.fl) * y ** (1 / .42), x = g / e.rgbD[0], ee = v / e.rgbD[1], S = b / e.rgbD[2];
		return [
			1.86206786 * x - 1.01125463 * ee + .14918677 * S,
			.38752654 * x + .62144744 * ee - .00897398 * S,
			-.0158415 * x - .03412294 * ee + 1.04996444 * S
		];
	}
}, yg = class e {
	static sanitizeRadians(e) {
		return (e + Math.PI * 8) % (Math.PI * 2);
	}
	static trueDelinearized(e) {
		let t = e / 100, n = 0;
		return n = t <= .0031308 ? t * 12.92 : 1.055 * t ** (1 / 2.4) - .055, n * 255;
	}
	static chromaticAdaptation(e) {
		let t = Math.abs(e) ** .42;
		return Uh(e) * 400 * t / (t + 27.13);
	}
	static hueOf(t) {
		let n = Xh(t, e.SCALED_DISCOUNT_FROM_LINRGB), r = e.chromaticAdaptation(n[0]), i = e.chromaticAdaptation(n[1]), a = e.chromaticAdaptation(n[2]), o = (11 * r + -12 * i + a) / 11, s = (r + i - 2 * a) / 9;
		return Math.atan2(s, o);
	}
	static areInCyclicOrder(t, n, r) {
		return e.sanitizeRadians(n - t) < e.sanitizeRadians(r - t);
	}
	static intercept(e, t, n) {
		return (t - e) / (n - e);
	}
	static lerpPoint(e, t, n) {
		return [
			e[0] + (n[0] - e[0]) * t,
			e[1] + (n[1] - e[1]) * t,
			e[2] + (n[2] - e[2]) * t
		];
	}
	static setCoordinate(t, n, r, i) {
		let a = e.intercept(t[i], n, r[i]);
		return e.lerpPoint(t, a, r);
	}
	static isBounded(e) {
		return 0 <= e && e <= 100;
	}
	static nthVertex(t, n) {
		let r = e.Y_FROM_LINRGB[0], i = e.Y_FROM_LINRGB[1], a = e.Y_FROM_LINRGB[2], o = n % 4 <= 1 ? 0 : 100, s = n % 2 == 0 ? 0 : 100;
		if (n < 4) {
			let n = o, c = s, l = (t - n * i - c * a) / r;
			return e.isBounded(l) ? [
				l,
				n,
				c
			] : [
				-1,
				-1,
				-1
			];
		} else if (n < 8) {
			let n = o, c = s, l = (t - c * r - n * a) / i;
			return e.isBounded(l) ? [
				c,
				l,
				n
			] : [
				-1,
				-1,
				-1
			];
		} else {
			let n = o, c = s, l = (t - n * r - c * i) / a;
			return e.isBounded(l) ? [
				n,
				c,
				l
			] : [
				-1,
				-1,
				-1
			];
		}
	}
	static bisectToSegment(t, n) {
		let r = [
			-1,
			-1,
			-1
		], i = r, a = 0, o = 0, s = !1, c = !0;
		for (let l = 0; l < 12; l++) {
			let u = e.nthVertex(t, l);
			if (u[0] < 0) continue;
			let d = e.hueOf(u);
			if (!s) {
				r = u, i = u, a = d, o = d, s = !0;
				continue;
			}
			(c || e.areInCyclicOrder(a, d, o)) && (c = !1, e.areInCyclicOrder(a, n, d) ? (i = u, o = d) : (r = u, a = d));
		}
		return [r, i];
	}
	static midpoint(e, t) {
		return [
			(e[0] + t[0]) / 2,
			(e[1] + t[1]) / 2,
			(e[2] + t[2]) / 2
		];
	}
	static criticalPlaneBelow(e) {
		return Math.floor(e - .5);
	}
	static criticalPlaneAbove(e) {
		return Math.ceil(e - .5);
	}
	static bisectToLimit(t, n) {
		let r = e.bisectToSegment(t, n), i = r[0], a = e.hueOf(i), o = r[1];
		for (let t = 0; t < 3; t++) if (i[t] !== o[t]) {
			let r = -1, s = 255;
			i[t] < o[t] ? (r = e.criticalPlaneBelow(e.trueDelinearized(i[t])), s = e.criticalPlaneAbove(e.trueDelinearized(o[t]))) : (r = e.criticalPlaneAbove(e.trueDelinearized(i[t])), s = e.criticalPlaneBelow(e.trueDelinearized(o[t])));
			for (let c = 0; c < 8 && !(Math.abs(s - r) <= 1); c++) {
				let c = Math.floor((r + s) / 2), l = e.CRITICAL_PLANES[c], u = e.setCoordinate(i, l, o, t), d = e.hueOf(u);
				e.areInCyclicOrder(a, n, d) ? (o = u, s = c) : (i = u, a = d, r = c);
			}
		}
		return e.midpoint(i, o);
	}
	static inverseChromaticAdaptation(e) {
		let t = Math.abs(e), n = Math.max(0, 27.13 * t / (400 - t));
		return Uh(e) * n ** (1 / .42);
	}
	static findResultByJ(t, n, r) {
		let i = Math.sqrt(r) * 11, a = _g.DEFAULT, o = 1 / (1.64 - .29 ** a.n) ** .73, s = .25 * (Math.cos(t + 2) + 3.8) * (5e4 / 13) * a.nc * a.ncb, c = Math.sin(t), l = Math.cos(t);
		for (let t = 0; t < 5; t++) {
			let u = i / 100, d = ((n === 0 || i === 0 ? 0 : n / Math.sqrt(u)) * o) ** (1 / .9), f = a.aw * u ** (1 / a.c / a.z) / a.nbb, p = 23 * (f + .305) * d / (23 * s + 11 * d * l + 108 * d * c), m = p * l, h = p * c, g = (460 * f + 451 * m + 288 * h) / 1403, _ = (460 * f - 891 * m - 261 * h) / 1403, v = (460 * f - 220 * m - 6300 * h) / 1403, y = Xh([
				e.inverseChromaticAdaptation(g),
				e.inverseChromaticAdaptation(_),
				e.inverseChromaticAdaptation(v)
			], e.LINRGB_FROM_SCALED_DISCOUNT);
			if (y[0] < 0 || y[1] < 0 || y[2] < 0) return 0;
			let b = e.Y_FROM_LINRGB[0], x = e.Y_FROM_LINRGB[1], ee = e.Y_FROM_LINRGB[2], S = b * y[0] + x * y[1] + ee * y[2];
			if (S <= 0) return 0;
			if (t === 4 || Math.abs(S - r) < .002) return y[0] > 100.01 || y[1] > 100.01 || y[2] > 100.01 ? 0 : tg(y);
			i -= (S - r) * i / (2 * S);
		}
		return 0;
	}
	static solveToInt(t, n, r) {
		if (n < 1e-4 || r < 1e-4 || r > 99.9999) return cg(r);
		t = Jh(t);
		let i = t / 180 * Math.PI, a = ug(r), o = e.findResultByJ(i, n, a);
		return o === 0 ? tg(e.bisectToLimit(a, i)) : o;
	}
	static solveToCam(t, n, r) {
		return vg.fromInt(e.solveToInt(t, n, r));
	}
};
yg.SCALED_DISCOUNT_FROM_LINRGB = [
	[
		.001200833568784504,
		.002389694492170889,
		.0002795742885861124
	],
	[
		.0005891086651375999,
		.0029785502573438758,
		.0003270666104008398
	],
	[
		.00010146692491640572,
		.0005364214359186694,
		.0032979401770712076
	]
], yg.LINRGB_FROM_SCALED_DISCOUNT = [
	[
		1373.2198709594231,
		-1100.4251190754821,
		-7.278681089101213
	],
	[
		-271.815969077903,
		559.6580465940733,
		-32.46047482791194
	],
	[
		1.9622899599665666,
		-57.173814538844006,
		308.7233197812385
	]
], yg.Y_FROM_LINRGB = [
	.2126,
	.7152,
	.0722
], yg.CRITICAL_PLANES = [
	.015176349177441876,
	.045529047532325624,
	.07588174588720938,
	.10623444424209313,
	.13658714259697685,
	.16693984095186062,
	.19729253930674434,
	.2276452376616281,
	.2579979360165119,
	.28835063437139563,
	.3188300904430532,
	.350925934958123,
	.3848314933096426,
	.42057480301049466,
	.458183274052838,
	.4976837250274023,
	.5391024159806381,
	.5824650784040898,
	.6277969426914107,
	.6751227633498623,
	.7244668422128921,
	.775853049866786,
	.829304845476233,
	.8848452951698498,
	.942497089126609,
	1.0022825574869039,
	1.0642236851973577,
	1.1283421258858297,
	1.1946592148522128,
	1.2631959812511864,
	1.3339731595349034,
	1.407011200216447,
	1.4823302800086415,
	1.5599503113873272,
	1.6398909516233677,
	1.7221716113234105,
	1.8068114625156377,
	1.8938294463134073,
	1.9832442801866852,
	2.075074464868551,
	2.1693382909216234,
	2.2660538449872063,
	2.36523901573795,
	2.4669114995532007,
	2.5710888059345764,
	2.6777882626779785,
	2.7870270208169257,
	2.898822059350997,
	3.0131901897720907,
	3.1301480604002863,
	3.2497121605402226,
	3.3718988244681087,
	3.4967242352587946,
	3.624204428461639,
	3.754355295633311,
	3.887192587735158,
	4.022731918402185,
	4.160988767090289,
	4.301978482107941,
	4.445716283538092,
	4.592217266055746,
	4.741496401646282,
	4.893568542229298,
	5.048448422192488,
	5.20615066083972,
	5.3666897647573375,
	5.5300801301023865,
	5.696336044816294,
	5.865471690767354,
	6.037501145825082,
	6.212438385869475,
	6.390297286737924,
	6.571091626112461,
	6.7548350853498045,
	6.941541251256611,
	7.131223617812143,
	7.323895587840543,
	7.5195704746346665,
	7.7182615035334345,
	7.919981813454504,
	8.124744458384042,
	8.332562408825165,
	8.543448553206703,
	8.757415699253682,
	8.974476575321063,
	9.194643831691977,
	9.417930041841839,
	9.644347703669503,
	9.873909240696694,
	10.106627003236781,
	10.342513269534024,
	10.58158024687427,
	10.8238400726681,
	11.069304815507364,
	11.317986476196008,
	11.569896988756009,
	11.825048221409341,
	12.083451977536606,
	12.345119996613247,
	12.610063955123938,
	12.878295467455942,
	13.149826086772048,
	13.42466730586372,
	13.702830557985108,
	13.984327217668513,
	14.269168601521828,
	14.55736596900856,
	14.848930523210871,
	15.143873411576273,
	15.44220572664832,
	15.743938506781891,
	16.04908273684337,
	16.35764934889634,
	16.66964922287304,
	16.985093187232053,
	17.30399201960269,
	17.62635644741625,
	17.95219714852476,
	18.281524751807332,
	18.614349837764564,
	18.95068293910138,
	19.290534541298456,
	19.633915083172692,
	19.98083495742689,
	20.331304511189067,
	20.685334046541502,
	21.042933821039977,
	21.404114048223256,
	21.76888489811322,
	22.137256497705877,
	22.50923893145328,
	22.884842241736916,
	23.264076429332462,
	23.6469514538663,
	24.033477234264016,
	24.42366364919083,
	24.817520537484558,
	25.21505769858089,
	25.61628489293138,
	26.021211842414342,
	26.429848230738664,
	26.842203703840827,
	27.258287870275353,
	27.678110301598522,
	28.10168053274597,
	28.529008062403893,
	28.96010235337422,
	29.39497283293396,
	29.83362889318845,
	30.276079891419332,
	30.722335150426627,
	31.172403958865512,
	31.62629557157785,
	32.08401920991837,
	32.54558406207592,
	33.010999283389665,
	33.4802739966603,
	33.953417292456834,
	34.430438229418264,
	34.911345834551085,
	35.39614910352207,
	35.88485700094671,
	36.37747846067349,
	36.87402238606382,
	37.37449765026789,
	37.87891309649659,
	38.38727753828926,
	38.89959975977785,
	39.41588851594697,
	39.93615253289054,
	40.460400508064545,
	40.98864111053629,
	41.520882981230194,
	42.05713473317016,
	42.597404951718396,
	43.141702194811224,
	43.6900349931913,
	44.24241185063697,
	44.798841244188324,
	45.35933162437017,
	45.92389141541209,
	46.49252901546552,
	47.065252796817916,
	47.64207110610409,
	48.22299226451468,
	48.808024568002054,
	49.3971762874833,
	49.9904556690408,
	50.587870934119984,
	51.189430279724725,
	51.79514187861014,
	52.40501387947288,
	53.0190544071392,
	53.637271562750364,
	54.259673423945976,
	54.88626804504493,
	55.517063457223934,
	56.15206766869424,
	56.79128866487574,
	57.43473440856916,
	58.08241284012621,
	58.734331877617365,
	59.39049941699807,
	60.05092333227251,
	60.715611475655585,
	61.38457167773311,
	62.057811747619894,
	62.7353394731159,
	63.417162620860914,
	64.10328893648692,
	64.79372614476921,
	65.48848194977529,
	66.18756403501224,
	66.89098006357258,
	67.59873767827808,
	68.31084450182222,
	69.02730813691093,
	69.74813616640164,
	70.47333615344107,
	71.20291564160104,
	71.93688215501312,
	72.67524319850172,
	73.41800625771542,
	74.16517879925733,
	74.9167682708136,
	75.67278210128072,
	76.43322770089146,
	77.1981124613393,
	77.96744375590167,
	78.74122893956174,
	79.51947534912904,
	80.30219030335869,
	81.08938110306934,
	81.88105503125999,
	82.67721935322541,
	83.4778813166706,
	84.28304815182372,
	85.09272707154808,
	85.90692527145302,
	86.72564993000343,
	87.54890820862819,
	88.3767072518277,
	89.2090541872801,
	90.04595612594655,
	90.88742016217518,
	91.73345337380438,
	92.58406282226491,
	93.43925555268066,
	94.29903859396902,
	95.16341895893969,
	96.03240364439274,
	96.9059996312159,
	97.78421388448044,
	98.6670533535366,
	99.55452497210776
];
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/hct/hct.js
var bg = class e {
	static from(t, n, r) {
		return new e(yg.solveToInt(t, n, r));
	}
	static fromInt(t) {
		return new e(t);
	}
	toInt() {
		return this.argb;
	}
	get hue() {
		return this.internalHue;
	}
	set hue(e) {
		this.setInternalState(yg.solveToInt(e, this.internalChroma, this.internalTone));
	}
	get chroma() {
		return this.internalChroma;
	}
	set chroma(e) {
		this.setInternalState(yg.solveToInt(this.internalHue, e, this.internalTone));
	}
	get tone() {
		return this.internalTone;
	}
	set tone(e) {
		this.setInternalState(yg.solveToInt(this.internalHue, this.internalChroma, e));
	}
	setValue(e, t) {
		this[e] = t;
	}
	toString() {
		return `HCT(${this.hue.toFixed(0)}, ${this.chroma.toFixed(0)}, ${this.tone.toFixed(0)})`;
	}
	static isBlue(e) {
		return e >= 250 && e < 270;
	}
	static isYellow(e) {
		return e >= 105 && e < 125;
	}
	static isCyan(e) {
		return e >= 170 && e < 207;
	}
	constructor(e) {
		this.argb = e;
		let t = vg.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = lg(e), this.argb = e;
	}
	setInternalState(e) {
		let t = vg.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = lg(e), this.argb = e;
	}
	inViewingConditions(t) {
		let n = vg.fromInt(this.toInt()).xyzInViewingConditions(t), r = vg.fromXyzInViewingConditions(n[0], n[1], n[2], _g.make());
		return e.from(r.hue, r.chroma, dg(n[1]));
	}
}, xg = class e {
	static ratioOfTones(t, n) {
		return t = Kh(0, 100, t), n = Kh(0, 100, n), e.ratioOfYs(ug(t), ug(n));
	}
	static ratioOfYs(e, t) {
		let n = e > t ? e : t, r = n === t ? e : t;
		return (n + 5) / (r + 5);
	}
	static lighter(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = ug(t), i = n * (r + 5) - 5, a = e.ratioOfYs(i, r), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = dg(i) + .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static darker(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = ug(t), i = (r + 5) / n - 5, a = e.ratioOfYs(r, i), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = dg(i) - .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static lighterUnsafe(t, n) {
		let r = e.lighter(t, n);
		return r < 0 ? 100 : r;
	}
	static darkerUnsafe(t, n) {
		let r = e.darker(t, n);
		return r < 0 ? 0 : r;
	}
}, Sg = class e {
	static isDisliked(e) {
		let t = Math.round(e.hue) >= 90 && Math.round(e.hue) <= 111, n = Math.round(e.chroma) > 16, r = Math.round(e.tone) < 65;
		return t && n && r;
	}
	static fixIfDisliked(t) {
		return e.isDisliked(t) ? bg.from(t.hue, t.chroma, 70) : t;
	}
};
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/dynamiccolor/dynamic_color.js
function Cg(e, t, n) {
	if (e.name !== n.name) throw Error(`Attempting to extend color ${e.name} with color ${n.name} of different name for spec version ${t}.`);
	if (e.isBackground !== n.isBackground) throw Error(`Attempting to extend color ${e.name} as a ${e.isBackground ? "background" : "foreground"} with color ${n.name} as a ${n.isBackground ? "background" : "foreground"} for spec version ${t}.`);
}
function q(e, t, n) {
	return Cg(e, t, n), J.fromPalette({
		name: e.name,
		palette: (r) => r.specVersion === t ? n.palette(r) : e.palette(r),
		tone: (r) => r.specVersion === t ? n.tone(r) : e.tone(r),
		isBackground: e.isBackground,
		chromaMultiplier: (r) => {
			let i = r.specVersion === t ? n.chromaMultiplier : e.chromaMultiplier;
			return i === void 0 ? 1 : i(r);
		},
		background: (r) => {
			let i = r.specVersion === t ? n.background : e.background;
			return i === void 0 ? void 0 : i(r);
		},
		secondBackground: (r) => {
			let i = r.specVersion === t ? n.secondBackground : e.secondBackground;
			return i === void 0 ? void 0 : i(r);
		},
		contrastCurve: (r) => {
			let i = r.specVersion === t ? n.contrastCurve : e.contrastCurve;
			return i === void 0 ? void 0 : i(r);
		},
		toneDeltaPair: (r) => {
			let i = r.specVersion === t ? n.toneDeltaPair : e.toneDeltaPair;
			return i === void 0 ? void 0 : i(r);
		}
	});
}
var J = class e {
	static fromPalette(t) {
		return new e(t.name ?? "", t.palette, t.tone ?? e.getInitialToneFromBackground(t.background), t.isBackground ?? !1, t.chromaMultiplier, t.background, t.secondBackground, t.contrastCurve, t.toneDeltaPair);
	}
	static getInitialToneFromBackground(e) {
		return e === void 0 ? (e) => 50 : (t) => e(t) ? e(t).getTone(t) : 50;
	}
	constructor(e, t, n, r, i, a, o, s, c) {
		if (this.name = e, this.palette = t, this.tone = n, this.isBackground = r, this.chromaMultiplier = i, this.background = a, this.secondBackground = o, this.contrastCurve = s, this.toneDeltaPair = c, this.hctCache = /* @__PURE__ */ new Map(), !a && o) throw Error(`Color ${e} has secondBackgrounddefined, but background is not defined.`);
		if (!a && s) throw Error(`Color ${e} has contrastCurvedefined, but background is not defined.`);
		if (a && !s) throw Error(`Color ${e} has backgrounddefined, but contrastCurve is not defined.`);
	}
	clone() {
		return e.fromPalette({
			name: this.name,
			palette: this.palette,
			tone: this.tone,
			isBackground: this.isBackground,
			chromaMultiplier: this.chromaMultiplier,
			background: this.background,
			secondBackground: this.secondBackground,
			contrastCurve: this.contrastCurve,
			toneDeltaPair: this.toneDeltaPair
		});
	}
	clearCache() {
		this.hctCache.clear();
	}
	getArgb(e) {
		return this.getHct(e).toInt();
	}
	getHct(e) {
		let t = this.hctCache.get(e);
		if (t != null) return t;
		let n = Og(e.specVersion).getHct(e, this);
		return this.hctCache.size > 4 && this.hctCache.clear(), this.hctCache.set(e, n), n;
	}
	getTone(e) {
		return Og(e.specVersion).getTone(e, this);
	}
	static foregroundTone(t, n) {
		let r = xg.lighterUnsafe(t, n), i = xg.darkerUnsafe(t, n), a = xg.ratioOfTones(r, t), o = xg.ratioOfTones(i, t);
		if (e.tonePrefersLightForeground(t)) {
			let e = Math.abs(a - o) < .1 && a < n && o < n;
			return a >= n || a >= o || e ? r : i;
		} else return o >= n || o >= a ? i : r;
	}
	static tonePrefersLightForeground(e) {
		return Math.round(e) < 60;
	}
	static toneAllowsLightForeground(e) {
		return Math.round(e) <= 49;
	}
	static enableLightForeground(t) {
		return e.tonePrefersLightForeground(t) && !e.toneAllowsLightForeground(t) ? 49 : t;
	}
}, wg = class {
	getHct(e, t) {
		let n = t.getTone(e);
		return t.palette(e).getHct(n);
	}
	getTone(e, t) {
		let n = e.contrastLevel < 0, r = t.toneDeltaPair ? t.toneDeltaPair(e) : void 0;
		if (r) {
			let i = r.roleA, a = r.roleB, o = r.delta, s = r.polarity, c = r.stayTogether, l = s === "nearer" || s === "lighter" && !e.isDark || s === "darker" && e.isDark, u = l ? i : a, d = l ? a : i, f = t.name === u.name, p = e.isDark ? 1 : -1, m = u.tone(e), h = d.tone(e);
			if (t.background && u.contrastCurve && d.contrastCurve) {
				let r = t.background(e), i = u.contrastCurve(e), a = d.contrastCurve(e);
				if (r && i && a) {
					let t = r.getTone(e), o = i.get(e.contrastLevel), s = a.get(e.contrastLevel);
					xg.ratioOfTones(t, m) < o && (m = J.foregroundTone(t, o)), xg.ratioOfTones(t, h) < s && (h = J.foregroundTone(t, s)), n && (m = J.foregroundTone(t, o), h = J.foregroundTone(t, s));
				}
			}
			return (h - m) * p < o && (h = Kh(0, 100, m + o * p), (h - m) * p >= o || (m = Kh(0, 100, h - o * p))), 50 <= m && m < 60 ? p > 0 ? (m = 60, h = Math.max(h, m + o * p)) : (m = 49, h = Math.min(h, m + o * p)) : 50 <= h && h < 60 && (c ? p > 0 ? (m = 60, h = Math.max(h, m + o * p)) : (m = 49, h = Math.min(h, m + o * p)) : h = p > 0 ? 60 : 49), f ? m : h;
		} else {
			let r = t.tone(e);
			if (t.background == null || t.background(e) === void 0 || t.contrastCurve == null || t.contrastCurve(e) === void 0) return r;
			let i = t.background(e).getTone(e), a = t.contrastCurve(e).get(e.contrastLevel);
			if (xg.ratioOfTones(i, r) >= a || (r = J.foregroundTone(i, a)), n && (r = J.foregroundTone(i, a)), t.isBackground && 50 <= r && r < 60 && (r = xg.ratioOfTones(49, i) >= a ? 49 : 60), t.secondBackground == null || t.secondBackground(e) === void 0) return r;
			let [o, s] = [t.background, t.secondBackground], [c, l] = [o(e).getTone(e), s(e).getTone(e)], [u, d] = [Math.max(c, l), Math.min(c, l)];
			if (xg.ratioOfTones(u, r) >= a && xg.ratioOfTones(d, r) >= a) return r;
			let f = xg.lighter(u, a), p = xg.darker(d, a), m = [];
			return f !== -1 && m.push(f), p !== -1 && m.push(p), J.tonePrefersLightForeground(c) || J.tonePrefersLightForeground(l) ? f < 0 ? 100 : f : m.length === 1 ? m[0] : p < 0 ? 0 : p;
		}
	}
}, Tg = class {
	getHct(e, t) {
		let n = t.palette(e), r = t.getTone(e), i = n.hue, a = n.chroma * (t.chromaMultiplier ? t.chromaMultiplier(e) : 1);
		return bg.from(i, a, r);
	}
	getTone(e, t) {
		let n = t.toneDeltaPair ? t.toneDeltaPair(e) : void 0;
		if (n) {
			let r = n.roleA, i = n.roleB, a = n.polarity, o = n.constraint, s = a === "darker" || a === "relative_lighter" && e.isDark || a === "relative_darker" && !e.isDark ? -n.delta : n.delta, c = t.name === r.name, l = c ? r : i, u = c ? i : r, d = l.tone(e), f = u.getTone(e), p = s * (c ? 1 : -1);
			if (o === "exact" ? d = Kh(0, 100, f + p) : o === "nearer" ? d = p > 0 ? Kh(0, 100, Kh(f, f + p, d)) : Kh(0, 100, Kh(f + p, f, d)) : o === "farther" && (d = p > 0 ? Kh(f + p, 100, d) : Kh(0, f + p, d)), t.background && t.contrastCurve) {
				let n = t.background(e), r = t.contrastCurve(e);
				if (n && r) {
					let t = n.getTone(e), i = r.get(e.contrastLevel);
					d = xg.ratioOfTones(t, d) >= i && e.contrastLevel >= 0 ? d : J.foregroundTone(t, i);
				}
			}
			return t.isBackground && !t.name.endsWith("_fixed_dim") && (d = d >= 57 ? Kh(65, 100, d) : Kh(0, 49, d)), d;
		} else {
			let n = t.tone(e);
			if (t.background == null || t.background(e) === void 0 || t.contrastCurve == null || t.contrastCurve(e) === void 0) return n;
			let r = t.background(e).getTone(e), i = t.contrastCurve(e).get(e.contrastLevel);
			if (n = xg.ratioOfTones(r, n) >= i && e.contrastLevel >= 0 ? n : J.foregroundTone(r, i), t.isBackground && !t.name.endsWith("_fixed_dim") && (n = n >= 57 ? Kh(65, 100, n) : Kh(0, 49, n)), t.secondBackground == null || t.secondBackground(e) === void 0) return n;
			let [a, o] = [t.background, t.secondBackground], [s, c] = [a(e).getTone(e), o(e).getTone(e)], [l, u] = [Math.max(s, c), Math.min(s, c)];
			if (xg.ratioOfTones(l, n) >= i && xg.ratioOfTones(u, n) >= i) return n;
			let d = xg.lighter(l, i), f = xg.darker(u, i), p = [];
			return d !== -1 && p.push(d), f !== -1 && p.push(f), J.tonePrefersLightForeground(s) || J.tonePrefersLightForeground(c) ? d < 0 ? 100 : d : p.length === 1 ? p[0] : f < 0 ? 0 : f;
		}
	}
}, Eg = new wg(), Dg = new Tg();
function Og(e) {
	return e === "2025" ? Dg : Eg;
}
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/palettes/tonal_palette.js
var Y = class e {
	static fromInt(t) {
		let n = bg.fromInt(t);
		return e.fromHct(n);
	}
	static fromHct(t) {
		return new e(t.hue, t.chroma, t);
	}
	static fromHueAndChroma(t, n) {
		return new e(t, n, new kg(t, n).create());
	}
	constructor(e, t, n) {
		this.hue = e, this.chroma = t, this.keyColor = n, this.cache = /* @__PURE__ */ new Map();
	}
	tone(e) {
		let t = this.cache.get(e);
		return t === void 0 && (t = e == 99 && bg.isYellow(this.hue) ? this.averageArgb(this.tone(98), this.tone(100)) : bg.from(this.hue, this.chroma, e).toInt(), this.cache.set(e, t)), t;
	}
	getHct(e) {
		return bg.fromInt(this.tone(e));
	}
	averageArgb(e, t) {
		let n = e >>> 16 & 255, r = e >>> 8 & 255, i = e & 255, a = t >>> 16 & 255, o = t >>> 8 & 255, s = t & 255, c = Math.round((n + a) / 2), l = Math.round((r + o) / 2), u = Math.round((i + s) / 2);
		return (255 << 24 | (c & 255) << 16 | (l & 255) << 8 | u & 255) >>> 0;
	}
}, kg = class {
	constructor(e, t) {
		this.hue = e, this.requestedChroma = t, this.chromaCache = /* @__PURE__ */ new Map(), this.maxChromaValue = 200;
	}
	create() {
		let e = 0, t = 100;
		for (; e < t;) {
			let n = Math.floor((e + t) / 2), r = this.maxChroma(n) < this.maxChroma(n + 1);
			if (this.maxChroma(n) >= this.requestedChroma - .01) if (Math.abs(e - 50) < Math.abs(t - 50)) t = n;
			else {
				if (e === n) return bg.from(this.hue, this.requestedChroma, e);
				e = n;
			}
			else r ? e = n + 1 : t = n;
		}
		return bg.from(this.hue, this.requestedChroma, e);
	}
	maxChroma(e) {
		if (this.chromaCache.has(e)) return this.chromaCache.get(e);
		let t = bg.from(this.hue, this.maxChromaValue, e).chroma;
		return this.chromaCache.set(e, t), t;
	}
}, Ag = class e {
	constructor(e) {
		this.input = e, this.hctsByTempCache = [], this.hctsByHueCache = [], this.tempsByHctCache = /* @__PURE__ */ new Map(), this.inputRelativeTemperatureCache = -1, this.complementCache = null;
	}
	get hctsByTemp() {
		if (this.hctsByTempCache.length > 0) return this.hctsByTempCache;
		let e = this.hctsByHue.concat([this.input]), t = this.tempsByHct;
		return e.sort((e, n) => t.get(e) - t.get(n)), this.hctsByTempCache = e, e;
	}
	get warmest() {
		return this.hctsByTemp[this.hctsByTemp.length - 1];
	}
	get coldest() {
		return this.hctsByTemp[0];
	}
	analogous(e = 5, t = 12) {
		let n = Math.round(this.input.hue), r = this.hctsByHue[n], i = this.relativeTemperature(r), a = [r], o = 0;
		for (let e = 0; e < 360; e++) {
			let t = qh(n + e), r = this.hctsByHue[t], a = this.relativeTemperature(r), s = Math.abs(a - i);
			i = a, o += s;
		}
		let s = 1, c = o / t, l = 0;
		for (i = this.relativeTemperature(r); a.length < t;) {
			let e = qh(n + s), r = this.hctsByHue[e], o = this.relativeTemperature(r), u = Math.abs(o - i);
			l += u;
			let d = a.length * c, f = l >= d, p = 1;
			for (; f && a.length < t;) {
				a.push(r);
				let e = (a.length + p) * c;
				f = l >= e, p++;
			}
			if (i = o, s++, s > 360) {
				for (; a.length < t;) a.push(r);
				break;
			}
		}
		let u = [this.input], d = Math.floor((e - 1) / 2);
		for (let e = 1; e < d + 1; e++) {
			let t = 0 - e;
			for (; t < 0;) t = a.length + t;
			t >= a.length && (t %= a.length), u.splice(0, 0, a[t]);
		}
		let f = e - d - 1;
		for (let e = 1; e < f + 1; e++) {
			let t = e;
			for (; t < 0;) t = a.length + t;
			t >= a.length && (t %= a.length), u.push(a[t]);
		}
		return u;
	}
	get complement() {
		if (this.complementCache != null) return this.complementCache;
		let t = this.coldest.hue, n = this.tempsByHct.get(this.coldest), r = this.warmest.hue, i = this.tempsByHct.get(this.warmest) - n, a = e.isBetween(this.input.hue, t, r), o = a ? r : t, s = a ? t : r, c = 1e3, l = this.hctsByHue[Math.round(this.input.hue)], u = 1 - this.inputRelativeTemperature;
		for (let t = 0; t <= 360; t += 1) {
			let r = Jh(o + 1 * t);
			if (!e.isBetween(r, o, s)) continue;
			let a = this.hctsByHue[Math.round(r)], d = (this.tempsByHct.get(a) - n) / i, f = Math.abs(u - d);
			f < c && (c = f, l = a);
		}
		return this.complementCache = l, this.complementCache;
	}
	relativeTemperature(e) {
		let t = this.tempsByHct.get(this.warmest) - this.tempsByHct.get(this.coldest), n = this.tempsByHct.get(e) - this.tempsByHct.get(this.coldest);
		return t === 0 ? .5 : n / t;
	}
	get inputRelativeTemperature() {
		return this.inputRelativeTemperatureCache >= 0 || (this.inputRelativeTemperatureCache = this.relativeTemperature(this.input)), this.inputRelativeTemperatureCache;
	}
	get tempsByHct() {
		if (this.tempsByHctCache.size > 0) return this.tempsByHctCache;
		let t = this.hctsByHue.concat([this.input]), n = /* @__PURE__ */ new Map();
		for (let r of t) n.set(r, e.rawTemperature(r));
		return this.tempsByHctCache = n, n;
	}
	get hctsByHue() {
		if (this.hctsByHueCache.length > 0) return this.hctsByHueCache;
		let e = [];
		for (let t = 0; t <= 360; t += 1) {
			let n = bg.from(t, this.input.chroma, this.input.tone);
			e.push(n);
		}
		return this.hctsByHueCache = e, this.hctsByHueCache;
	}
	static isBetween(e, t, n) {
		return t < n ? t <= e && e <= n : t <= e || e <= n;
	}
	static rawTemperature(e) {
		let t = sg(e.toInt()), n = Jh(Math.atan2(t[2], t[1]) * 180 / Math.PI);
		return -.5 + .02 * Math.sqrt(t[1] * t[1] + t[2] * t[2]) ** 1.07 * Math.cos(Jh(n - 50) * Math.PI / 180);
	}
}, X = class {
	constructor(e, t, n, r) {
		this.low = e, this.normal = t, this.medium = n, this.high = r;
	}
	get(e) {
		return e <= -1 ? this.low : e < 0 ? Wh(this.low, this.normal, (e - -1) / 1) : e < .5 ? Wh(this.normal, this.medium, (e - 0) / .5) : e < 1 ? Wh(this.medium, this.high, (e - .5) / .5) : this.high;
	}
}, jg = class {
	constructor(e, t, n, r, i, a) {
		this.roleA = e, this.roleB = t, this.delta = n, this.polarity = r, this.stayTogether = i, this.constraint = a, this.constraint = a ?? "exact";
	}
}, Z;
(function(e) {
	e[e.MONOCHROME = 0] = "MONOCHROME", e[e.NEUTRAL = 1] = "NEUTRAL", e[e.TONAL_SPOT = 2] = "TONAL_SPOT", e[e.VIBRANT = 3] = "VIBRANT", e[e.EXPRESSIVE = 4] = "EXPRESSIVE", e[e.FIDELITY = 5] = "FIDELITY", e[e.CONTENT = 6] = "CONTENT", e[e.RAINBOW = 7] = "RAINBOW", e[e.FRUIT_SALAD = 8] = "FRUIT_SALAD";
})(Z ||= {});
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/dynamiccolor/color_spec_2021.js
function Mg(e) {
	return e.variant === Z.FIDELITY || e.variant === Z.CONTENT;
}
function Ng(e) {
	return e.variant === Z.MONOCHROME;
}
function Pg(e, t, n, r) {
	let i = n, a = bg.from(e, t, n);
	if (a.chroma < t) {
		let n = a.chroma;
		for (; a.chroma < t;) {
			i += r ? -1 : 1;
			let o = bg.from(e, t, i);
			if (n > o.chroma || Math.abs(o.chroma - t) < .4) break;
			Math.abs(o.chroma - t) < Math.abs(a.chroma - t) && (a = o), n = Math.max(n, o.chroma);
		}
	}
	return i;
}
var Fg = class {
	primaryPaletteKeyColor() {
		return J.fromPalette({
			name: "primary_palette_key_color",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.primaryPalette.keyColor.tone
		});
	}
	secondaryPaletteKeyColor() {
		return J.fromPalette({
			name: "secondary_palette_key_color",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.secondaryPalette.keyColor.tone
		});
	}
	tertiaryPaletteKeyColor() {
		return J.fromPalette({
			name: "tertiary_palette_key_color",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.tertiaryPalette.keyColor.tone
		});
	}
	neutralPaletteKeyColor() {
		return J.fromPalette({
			name: "neutral_palette_key_color",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.neutralPalette.keyColor.tone
		});
	}
	neutralVariantPaletteKeyColor() {
		return J.fromPalette({
			name: "neutral_variant_palette_key_color",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.neutralVariantPalette.keyColor.tone
		});
	}
	errorPaletteKeyColor() {
		return J.fromPalette({
			name: "error_palette_key_color",
			palette: (e) => e.errorPalette,
			tone: (e) => e.errorPalette.keyColor.tone
		});
	}
	background() {
		return J.fromPalette({
			name: "background",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : 98,
			isBackground: !0
		});
	}
	onBackground() {
		return J.fromPalette({
			name: "on_background",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 10,
			background: (e) => this.background(),
			contrastCurve: (e) => new X(3, 3, 4.5, 7)
		});
	}
	surface() {
		return J.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : 98,
			isBackground: !0
		});
	}
	surfaceDim() {
		return J.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 6 : new X(87, 87, 80, 75).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceBright() {
		return J.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new X(24, 24, 29, 34).get(e.contrastLevel) : 98,
			isBackground: !0
		});
	}
	surfaceContainerLowest() {
		return J.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new X(4, 4, 2, 0).get(e.contrastLevel) : 100,
			isBackground: !0
		});
	}
	surfaceContainerLow() {
		return J.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new X(10, 10, 11, 12).get(e.contrastLevel) : new X(96, 96, 96, 95).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainer() {
		return J.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new X(12, 12, 16, 20).get(e.contrastLevel) : new X(94, 94, 92, 90).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainerHigh() {
		return J.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new X(17, 17, 21, 25).get(e.contrastLevel) : new X(92, 92, 88, 85).get(e.contrastLevel),
			isBackground: !0
		});
	}
	surfaceContainerHighest() {
		return J.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? new X(22, 22, 26, 30).get(e.contrastLevel) : new X(90, 90, 84, 80).get(e.contrastLevel),
			isBackground: !0
		});
	}
	onSurface() {
		return J.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 10,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(4.5, 7, 11, 21)
		});
	}
	surfaceVariant() {
		return J.fromPalette({
			name: "surface_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 30 : 90,
			isBackground: !0
		});
	}
	onSurfaceVariant() {
		return J.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 80 : 30,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(3, 4.5, 7, 11)
		});
	}
	inverseSurface() {
		return J.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 90 : 20,
			isBackground: !0
		});
	}
	inverseOnSurface() {
		return J.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 20 : 95,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => new X(4.5, 7, 11, 21)
		});
	}
	outline() {
		return J.fromPalette({
			name: "outline",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 60 : 50,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1.5, 3, 4.5, 7)
		});
	}
	outlineVariant() {
		return J.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralVariantPalette,
			tone: (e) => e.isDark ? 30 : 80,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5)
		});
	}
	shadow() {
		return J.fromPalette({
			name: "shadow",
			palette: (e) => e.neutralPalette,
			tone: (e) => 0
		});
	}
	scrim() {
		return J.fromPalette({
			name: "scrim",
			palette: (e) => e.neutralPalette,
			tone: (e) => 0
		});
	}
	surfaceTint() {
		return J.fromPalette({
			name: "surface_tint",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0
		});
	}
	primary() {
		return J.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => Ng(e) ? e.isDark ? 100 : 0 : e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new jg(this.primaryContainer(), this.primary(), 10, "nearer", !1)
		});
	}
	primaryDim() {}
	onPrimary() {
		return J.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => Ng(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
			background: (e) => this.primary(),
			contrastCurve: (e) => new X(4.5, 7, 11, 21)
		});
	}
	primaryContainer() {
		return J.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => Mg(e) ? e.sourceColorHct.tone : Ng(e) ? e.isDark ? 85 : 25 : e.isDark ? 30 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new jg(this.primaryContainer(), this.primary(), 10, "nearer", !1)
		});
	}
	onPrimaryContainer() {
		return J.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => Mg(e) ? J.foregroundTone(this.primaryContainer().tone(e), 4.5) : Ng(e) ? e.isDark ? 0 : 100 : e.isDark ? 90 : 30,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => new X(3, 4.5, 7, 11)
		});
	}
	inversePrimary() {
		return J.fromPalette({
			name: "inverse_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.isDark ? 40 : 80,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => new X(3, 4.5, 7, 7)
		});
	}
	secondary() {
		return J.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new jg(this.secondaryContainer(), this.secondary(), 10, "nearer", !1)
		});
	}
	secondaryDim() {}
	onSecondary() {
		return J.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => Ng(e) ? e.isDark ? 10 : 100 : e.isDark ? 20 : 100,
			background: (e) => this.secondary(),
			contrastCurve: (e) => new X(4.5, 7, 11, 21)
		});
	}
	secondaryContainer() {
		return J.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => {
				let t = e.isDark ? 30 : 90;
				return Ng(e) ? e.isDark ? 30 : 85 : Mg(e) ? Pg(e.secondaryPalette.hue, e.secondaryPalette.chroma, t, !e.isDark) : t;
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new jg(this.secondaryContainer(), this.secondary(), 10, "nearer", !1)
		});
	}
	onSecondaryContainer() {
		return J.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => Ng(e) ? e.isDark ? 90 : 10 : Mg(e) ? J.foregroundTone(this.secondaryContainer().tone(e), 4.5) : e.isDark ? 90 : 30,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => new X(3, 4.5, 7, 11)
		});
	}
	tertiary() {
		return J.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => Ng(e) ? e.isDark ? 90 : 25 : e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new jg(this.tertiaryContainer(), this.tertiary(), 10, "nearer", !1)
		});
	}
	tertiaryDim() {}
	onTertiary() {
		return J.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => Ng(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
			background: (e) => this.tertiary(),
			contrastCurve: (e) => new X(4.5, 7, 11, 21)
		});
	}
	tertiaryContainer() {
		return J.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				if (Ng(e)) return e.isDark ? 60 : 49;
				if (!Mg(e)) return e.isDark ? 30 : 90;
				let t = e.tertiaryPalette.getHct(e.sourceColorHct.tone);
				return Sg.fixIfDisliked(t).tone;
			},
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new jg(this.tertiaryContainer(), this.tertiary(), 10, "nearer", !1)
		});
	}
	onTertiaryContainer() {
		return J.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => Ng(e) ? e.isDark ? 0 : 100 : Mg(e) ? J.foregroundTone(this.tertiaryContainer().tone(e), 4.5) : e.isDark ? 90 : 30,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => new X(3, 4.5, 7, 11)
		});
	}
	error() {
		return J.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 80 : 40,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(3, 4.5, 7, 7),
			toneDeltaPair: (e) => new jg(this.errorContainer(), this.error(), 10, "nearer", !1)
		});
	}
	errorDim() {}
	onError() {
		return J.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 20 : 100,
			background: (e) => this.error(),
			contrastCurve: (e) => new X(4.5, 7, 11, 21)
		});
	}
	errorContainer() {
		return J.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.isDark ? 30 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new jg(this.errorContainer(), this.error(), 10, "nearer", !1)
		});
	}
	onErrorContainer() {
		return J.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => Ng(e) ? e.isDark ? 90 : 10 : e.isDark ? 90 : 30,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => new X(3, 4.5, 7, 11)
		});
	}
	primaryFixed() {
		return J.fromPalette({
			name: "primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => Ng(e) ? 40 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new jg(this.primaryFixed(), this.primaryFixedDim(), 10, "lighter", !0)
		});
	}
	primaryFixedDim() {
		return J.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => Ng(e) ? 30 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new jg(this.primaryFixed(), this.primaryFixedDim(), 10, "lighter", !0)
		});
	}
	onPrimaryFixed() {
		return J.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => Ng(e) ? 100 : 10,
			background: (e) => this.primaryFixedDim(),
			secondBackground: (e) => this.primaryFixed(),
			contrastCurve: (e) => new X(4.5, 7, 11, 21)
		});
	}
	onPrimaryFixedVariant() {
		return J.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			tone: (e) => Ng(e) ? 90 : 30,
			background: (e) => this.primaryFixedDim(),
			secondBackground: (e) => this.primaryFixed(),
			contrastCurve: (e) => new X(3, 4.5, 7, 11)
		});
	}
	secondaryFixed() {
		return J.fromPalette({
			name: "secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => Ng(e) ? 80 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new jg(this.secondaryFixed(), this.secondaryFixedDim(), 10, "lighter", !0)
		});
	}
	secondaryFixedDim() {
		return J.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => Ng(e) ? 70 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new jg(this.secondaryFixed(), this.secondaryFixedDim(), 10, "lighter", !0)
		});
	}
	onSecondaryFixed() {
		return J.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => 10,
			background: (e) => this.secondaryFixedDim(),
			secondBackground: (e) => this.secondaryFixed(),
			contrastCurve: (e) => new X(4.5, 7, 11, 21)
		});
	}
	onSecondaryFixedVariant() {
		return J.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			tone: (e) => Ng(e) ? 25 : 30,
			background: (e) => this.secondaryFixedDim(),
			secondBackground: (e) => this.secondaryFixed(),
			contrastCurve: (e) => new X(3, 4.5, 7, 11)
		});
	}
	tertiaryFixed() {
		return J.fromPalette({
			name: "tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => Ng(e) ? 40 : 90,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new jg(this.tertiaryFixed(), this.tertiaryFixedDim(), 10, "lighter", !0)
		});
	}
	tertiaryFixedDim() {
		return J.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => Ng(e) ? 30 : 80,
			isBackground: !0,
			background: (e) => this.highestSurface(e),
			contrastCurve: (e) => new X(1, 1, 3, 4.5),
			toneDeltaPair: (e) => new jg(this.tertiaryFixed(), this.tertiaryFixedDim(), 10, "lighter", !0)
		});
	}
	onTertiaryFixed() {
		return J.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => Ng(e) ? 100 : 10,
			background: (e) => this.tertiaryFixedDim(),
			secondBackground: (e) => this.tertiaryFixed(),
			contrastCurve: (e) => new X(4.5, 7, 11, 21)
		});
	}
	onTertiaryFixedVariant() {
		return J.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => Ng(e) ? 90 : 30,
			background: (e) => this.tertiaryFixedDim(),
			secondBackground: (e) => this.tertiaryFixed(),
			contrastCurve: (e) => new X(3, 4.5, 7, 11)
		});
	}
	highestSurface(e) {
		return e.isDark ? this.surfaceBright() : this.surfaceDim();
	}
};
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/dynamiccolor/color_spec_2025.js
function Ig(e, t = 0, n = 100, r = 1) {
	return Kh(t, n, Rg(e.hue, e.chroma * r, 100, !0));
}
function Lg(e, t = 0, n = 100) {
	return Kh(t, n, Rg(e.hue, e.chroma, 0, !1));
}
function Rg(e, t, n, r) {
	let i = n, a = bg.from(e, t, i);
	for (; a.chroma < t && !(n < 0 || n > 100);) {
		n += r ? -1 : 1;
		let o = bg.from(e, t, n);
		a.chroma < o.chroma && (a = o, i = n);
	}
	return i;
}
function Q(e) {
	return e === 1.5 ? new X(1.5, 1.5, 3, 5.5) : e === 3 ? new X(3, 3, 4.5, 7) : e === 4.5 ? new X(4.5, 4.5, 7, 11) : e === 6 ? new X(6, 6, 7, 11) : e === 7 ? new X(7, 7, 11, 21) : e === 9 ? new X(9, 9, 11, 21) : e === 11 ? new X(11, 11, 21, 21) : e === 21 ? new X(21, 21, 21, 21) : new X(e, e, 7, 21);
}
var zg = class extends Fg {
	surface() {
		let e = J.fromPalette({
			name: "surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => (super.surface().tone(e), e.platform === "phone" ? e.isDark ? 4 : bg.isYellow(e.neutralPalette.hue) ? 99 : e.variant === Z.VIBRANT ? 97 : 98 : 0),
			isBackground: !0
		});
		return q(super.surface(), "2025", e);
	}
	surfaceDim() {
		let e = J.fromPalette({
			name: "surface_dim",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 4 : bg.isYellow(e.neutralPalette.hue) ? 90 : e.variant === Z.VIBRANT ? 85 : 87,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (!e.isDark) {
					if (e.variant === Z.NEUTRAL) return 2.5;
					if (e.variant === Z.TONAL_SPOT) return 1.7;
					if (e.variant === Z.EXPRESSIVE) return bg.isYellow(e.neutralPalette.hue) ? 2.7 : 1.75;
					if (e.variant === Z.VIBRANT) return 1.36;
				}
				return 1;
			}
		});
		return q(super.surfaceDim(), "2025", e);
	}
	surfaceBright() {
		let e = J.fromPalette({
			name: "surface_bright",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 18 : bg.isYellow(e.neutralPalette.hue) ? 99 : e.variant === Z.VIBRANT ? 97 : 98,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.isDark) {
					if (e.variant === Z.NEUTRAL) return 2.5;
					if (e.variant === Z.TONAL_SPOT) return 1.7;
					if (e.variant === Z.EXPRESSIVE) return bg.isYellow(e.neutralPalette.hue) ? 2.7 : 1.75;
					if (e.variant === Z.VIBRANT) return 1.36;
				}
				return 1;
			}
		});
		return q(super.surfaceBright(), "2025", e);
	}
	surfaceContainerLowest() {
		let e = J.fromPalette({
			name: "surface_container_lowest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 0 : 100,
			isBackground: !0
		});
		return q(super.surfaceContainerLowest(), "2025", e);
	}
	surfaceContainerLow() {
		let e = J.fromPalette({
			name: "surface_container_low",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 6 : bg.isYellow(e.neutralPalette.hue) ? 98 : e.variant === Z.VIBRANT ? 95 : 96 : 15,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === Z.NEUTRAL) return 1.3;
					if (e.variant === Z.TONAL_SPOT) return 1.25;
					if (e.variant === Z.EXPRESSIVE) return bg.isYellow(e.neutralPalette.hue) ? 1.3 : 1.15;
					if (e.variant === Z.VIBRANT) return 1.08;
				}
				return 1;
			}
		});
		return q(super.surfaceContainerLow(), "2025", e);
	}
	surfaceContainer() {
		let e = J.fromPalette({
			name: "surface_container",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 9 : bg.isYellow(e.neutralPalette.hue) ? 96 : e.variant === Z.VIBRANT ? 92 : 94 : 20,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === Z.NEUTRAL) return 1.6;
					if (e.variant === Z.TONAL_SPOT) return 1.4;
					if (e.variant === Z.EXPRESSIVE) return bg.isYellow(e.neutralPalette.hue) ? 1.6 : 1.3;
					if (e.variant === Z.VIBRANT) return 1.15;
				}
				return 1;
			}
		});
		return q(super.surfaceContainer(), "2025", e);
	}
	surfaceContainerHigh() {
		let e = J.fromPalette({
			name: "surface_container_high",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? 12 : bg.isYellow(e.neutralPalette.hue) ? 94 : e.variant === Z.VIBRANT ? 90 : 92 : 25,
			isBackground: !0,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === Z.NEUTRAL) return 1.9;
					if (e.variant === Z.TONAL_SPOT) return 1.5;
					if (e.variant === Z.EXPRESSIVE) return bg.isYellow(e.neutralPalette.hue) ? 1.95 : 1.45;
					if (e.variant === Z.VIBRANT) return 1.22;
				}
				return 1;
			}
		});
		return q(super.surfaceContainerHigh(), "2025", e);
	}
	surfaceContainerHighest() {
		let e = J.fromPalette({
			name: "surface_container_highest",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 15 : bg.isYellow(e.neutralPalette.hue) ? 92 : e.variant === Z.VIBRANT ? 88 : 90,
			isBackground: !0,
			chromaMultiplier: (e) => e.variant === Z.NEUTRAL ? 2.2 : e.variant === Z.TONAL_SPOT ? 1.7 : e.variant === Z.EXPRESSIVE ? bg.isYellow(e.neutralPalette.hue) ? 2.3 : 1.6 : e.variant === Z.VIBRANT ? 1.29 : 1
		});
		return q(super.surfaceContainerHighest(), "2025", e);
	}
	onSurface() {
		let e = J.fromPalette({
			name: "on_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.variant === Z.VIBRANT ? Ig(e.neutralPalette, 0, 100, 1.1) : J.getInitialToneFromBackground((e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh())(e),
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === Z.NEUTRAL) return 2.2;
					if (e.variant === Z.TONAL_SPOT) return 1.7;
					if (e.variant === Z.EXPRESSIVE) return bg.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.isDark && e.platform === "phone" ? Q(11) : Q(9)
		});
		return q(super.onSurface(), "2025", e);
	}
	onSurfaceVariant() {
		let e = J.fromPalette({
			name: "on_surface_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === Z.NEUTRAL) return 2.2;
					if (e.variant === Z.TONAL_SPOT) return 1.7;
					if (e.variant === Z.EXPRESSIVE) return bg.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? e.isDark ? Q(6) : Q(4.5) : Q(7)
		});
		return q(super.onSurfaceVariant(), "2025", e);
	}
	outline() {
		let e = J.fromPalette({
			name: "outline",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === Z.NEUTRAL) return 2.2;
					if (e.variant === Z.TONAL_SPOT) return 1.7;
					if (e.variant === Z.EXPRESSIVE) return bg.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? Q(3) : Q(4.5)
		});
		return q(super.outline(), "2025", e);
	}
	outlineVariant() {
		let e = J.fromPalette({
			name: "outline_variant",
			palette: (e) => e.neutralPalette,
			chromaMultiplier: (e) => {
				if (e.platform === "phone") {
					if (e.variant === Z.NEUTRAL) return 2.2;
					if (e.variant === Z.TONAL_SPOT) return 1.7;
					if (e.variant === Z.EXPRESSIVE) return bg.isYellow(e.neutralPalette.hue) ? e.isDark ? 3 : 2.3 : 1.6;
				}
				return 1;
			},
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? Q(1.5) : Q(3)
		});
		return q(super.outlineVariant(), "2025", e);
	}
	inverseSurface() {
		let e = J.fromPalette({
			name: "inverse_surface",
			palette: (e) => e.neutralPalette,
			tone: (e) => e.isDark ? 98 : 4,
			isBackground: !0
		});
		return q(super.inverseSurface(), "2025", e);
	}
	inverseOnSurface() {
		let e = J.fromPalette({
			name: "inverse_on_surface",
			palette: (e) => e.neutralPalette,
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => Q(7)
		});
		return q(super.inverseOnSurface(), "2025", e);
	}
	primary() {
		let e = J.fromPalette({
			name: "primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.variant === Z.NEUTRAL ? e.platform === "phone" ? e.isDark ? 80 : 40 : 90 : e.variant === Z.TONAL_SPOT ? e.platform === "phone" ? e.isDark ? 80 : Ig(e.primaryPalette) : Ig(e.primaryPalette, 0, 90) : e.variant === Z.EXPRESSIVE ? e.platform === "phone" ? Ig(e.primaryPalette, 0, bg.isYellow(e.primaryPalette.hue) ? 25 : bg.isCyan(e.primaryPalette.hue) ? 88 : 98) : Ig(e.primaryPalette) : e.platform === "phone" ? Ig(e.primaryPalette, 0, bg.isCyan(e.primaryPalette.hue) ? 88 : 98) : Ig(e.primaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? Q(4.5) : Q(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new jg(this.primaryContainer(), this.primary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return q(super.primary(), "2025", e);
	}
	primaryDim() {
		return J.fromPalette({
			name: "primary_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.variant === Z.NEUTRAL ? 85 : e.variant === Z.TONAL_SPOT ? Ig(e.primaryPalette, 0, 90) : Ig(e.primaryPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => Q(4.5),
			toneDeltaPair: (e) => new jg(this.primaryDim(), this.primary(), 5, "darker", !0, "farther")
		});
	}
	onPrimary() {
		let e = J.fromPalette({
			name: "on_primary",
			palette: (e) => e.primaryPalette,
			background: (e) => e.platform === "phone" ? this.primary() : this.primaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? Q(6) : Q(7)
		});
		return q(super.onPrimary(), "2025", e);
	}
	primaryContainer() {
		let e = J.fromPalette({
			name: "primary_container",
			palette: (e) => e.primaryPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.variant === Z.NEUTRAL ? e.isDark ? 30 : 90 : e.variant === Z.TONAL_SPOT ? e.isDark ? Lg(e.primaryPalette, 35, 93) : Ig(e.primaryPalette, 0, 90) : e.variant === Z.EXPRESSIVE ? e.isDark ? Ig(e.primaryPalette, 30, 93) : Ig(e.primaryPalette, 78, bg.isCyan(e.primaryPalette.hue) ? 88 : 90) : e.isDark ? Lg(e.primaryPalette, 66, 93) : Ig(e.primaryPalette, 66, bg.isCyan(e.primaryPalette.hue) ? 88 : 93),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "phone" ? void 0 : new jg(this.primaryContainer(), this.primaryDim(), 10, "darker", !0, "farther"),
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? Q(1.5) : void 0
		});
		return q(super.primaryContainer(), "2025", e);
	}
	onPrimaryContainer() {
		let e = J.fromPalette({
			name: "on_primary_container",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? Q(6) : Q(7)
		});
		return q(super.onPrimaryContainer(), "2025", e);
	}
	primaryFixed() {
		let e = J.fromPalette({
			name: "primary_fixed",
			palette: (e) => e.primaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.primaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? Q(1.5) : void 0
		});
		return q(super.primaryFixed(), "2025", e);
	}
	primaryFixedDim() {
		let e = J.fromPalette({
			name: "primary_fixed_dim",
			palette: (e) => e.primaryPalette,
			tone: (e) => this.primaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new jg(this.primaryFixedDim(), this.primaryFixed(), 5, "darker", !0, "exact")
		});
		return q(super.primaryFixedDim(), "2025", e);
	}
	onPrimaryFixed() {
		let e = J.fromPalette({
			name: "on_primary_fixed",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixedDim(),
			contrastCurve: (e) => Q(7)
		});
		return q(super.onPrimaryFixed(), "2025", e);
	}
	onPrimaryFixedVariant() {
		let e = J.fromPalette({
			name: "on_primary_fixed_variant",
			palette: (e) => e.primaryPalette,
			background: (e) => this.primaryFixedDim(),
			contrastCurve: (e) => Q(4.5)
		});
		return q(super.onPrimaryFixedVariant(), "2025", e);
	}
	inversePrimary() {
		let e = J.fromPalette({
			name: "inverse_primary",
			palette: (e) => e.primaryPalette,
			tone: (e) => Ig(e.primaryPalette),
			background: (e) => this.inverseSurface(),
			contrastCurve: (e) => e.platform === "phone" ? Q(6) : Q(7)
		});
		return q(super.inversePrimary(), "2025", e);
	}
	secondary() {
		let e = J.fromPalette({
			name: "secondary",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === Z.NEUTRAL ? 90 : Ig(e.secondaryPalette, 0, 90) : e.variant === Z.NEUTRAL ? e.isDark ? Lg(e.secondaryPalette, 0, 98) : Ig(e.secondaryPalette) : e.variant === Z.VIBRANT ? Ig(e.secondaryPalette, 0, e.isDark ? 90 : 98) : e.isDark ? 80 : Ig(e.secondaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? Q(4.5) : Q(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new jg(this.secondaryContainer(), this.secondary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return q(super.secondary(), "2025", e);
	}
	secondaryDim() {
		return J.fromPalette({
			name: "secondary_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.variant === Z.NEUTRAL ? 85 : Ig(e.secondaryPalette, 0, 90),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => Q(4.5),
			toneDeltaPair: (e) => new jg(this.secondaryDim(), this.secondary(), 5, "darker", !0, "farther")
		});
	}
	onSecondary() {
		let e = J.fromPalette({
			name: "on_secondary",
			palette: (e) => e.secondaryPalette,
			background: (e) => e.platform === "phone" ? this.secondary() : this.secondaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? Q(6) : Q(7)
		});
		return q(super.onSecondary(), "2025", e);
	}
	secondaryContainer() {
		let e = J.fromPalette({
			name: "secondary_container",
			palette: (e) => e.secondaryPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.variant === Z.VIBRANT ? e.isDark ? Lg(e.secondaryPalette, 30, 40) : Ig(e.secondaryPalette, 84, 90) : e.variant === Z.EXPRESSIVE ? e.isDark ? 15 : Ig(e.secondaryPalette, 90, 95) : e.isDark ? 25 : 90,
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new jg(this.secondaryContainer(), this.secondaryDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? Q(1.5) : void 0
		});
		return q(super.secondaryContainer(), "2025", e);
	}
	onSecondaryContainer() {
		let e = J.fromPalette({
			name: "on_secondary_container",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? Q(6) : Q(7)
		});
		return q(super.onSecondaryContainer(), "2025", e);
	}
	secondaryFixed() {
		let e = J.fromPalette({
			name: "secondary_fixed",
			palette: (e) => e.secondaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.secondaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? Q(1.5) : void 0
		});
		return q(super.secondaryFixed(), "2025", e);
	}
	secondaryFixedDim() {
		let e = J.fromPalette({
			name: "secondary_fixed_dim",
			palette: (e) => e.secondaryPalette,
			tone: (e) => this.secondaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new jg(this.secondaryFixedDim(), this.secondaryFixed(), 5, "darker", !0, "exact")
		});
		return q(super.secondaryFixedDim(), "2025", e);
	}
	onSecondaryFixed() {
		let e = J.fromPalette({
			name: "on_secondary_fixed",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixedDim(),
			contrastCurve: (e) => Q(7)
		});
		return q(super.onSecondaryFixed(), "2025", e);
	}
	onSecondaryFixedVariant() {
		let e = J.fromPalette({
			name: "on_secondary_fixed_variant",
			palette: (e) => e.secondaryPalette,
			background: (e) => this.secondaryFixedDim(),
			contrastCurve: (e) => Q(4.5)
		});
		return q(super.onSecondaryFixedVariant(), "2025", e);
	}
	tertiary() {
		let e = J.fromPalette({
			name: "tertiary",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === Z.TONAL_SPOT ? Ig(e.tertiaryPalette, 0, 90) : Ig(e.tertiaryPalette) : e.variant === Z.EXPRESSIVE || e.variant === Z.VIBRANT ? Ig(e.tertiaryPalette, 0, bg.isCyan(e.tertiaryPalette.hue) ? 88 : e.isDark ? 98 : 100) : e.isDark ? Ig(e.tertiaryPalette, 0, 98) : Ig(e.tertiaryPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? Q(4.5) : Q(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new jg(this.tertiaryContainer(), this.tertiary(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return q(super.tertiary(), "2025", e);
	}
	tertiaryDim() {
		return J.fromPalette({
			name: "tertiary_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.variant === Z.TONAL_SPOT ? Ig(e.tertiaryPalette, 0, 90) : Ig(e.tertiaryPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => Q(4.5),
			toneDeltaPair: (e) => new jg(this.tertiaryDim(), this.tertiary(), 5, "darker", !0, "farther")
		});
	}
	onTertiary() {
		let e = J.fromPalette({
			name: "on_tertiary",
			palette: (e) => e.tertiaryPalette,
			background: (e) => e.platform === "phone" ? this.tertiary() : this.tertiaryDim(),
			contrastCurve: (e) => e.platform === "phone" ? Q(6) : Q(7)
		});
		return q(super.onTertiary(), "2025", e);
	}
	tertiaryContainer() {
		let e = J.fromPalette({
			name: "tertiary_container",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => e.platform === "watch" ? e.variant === Z.TONAL_SPOT ? Ig(e.tertiaryPalette, 0, 90) : Ig(e.tertiaryPalette) : e.variant === Z.NEUTRAL ? e.isDark ? Ig(e.tertiaryPalette, 0, 93) : Ig(e.tertiaryPalette, 0, 96) : e.variant === Z.TONAL_SPOT ? Ig(e.tertiaryPalette, 0, e.isDark ? 93 : 100) : e.variant === Z.EXPRESSIVE ? Ig(e.tertiaryPalette, 75, bg.isCyan(e.tertiaryPalette.hue) ? 88 : e.isDark ? 93 : 100) : e.isDark ? Ig(e.tertiaryPalette, 0, 93) : Ig(e.tertiaryPalette, 72, 100),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new jg(this.tertiaryContainer(), this.tertiaryDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? Q(1.5) : void 0
		});
		return q(super.tertiaryContainer(), "2025", e);
	}
	onTertiaryContainer() {
		let e = J.fromPalette({
			name: "on_tertiary_container",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryContainer(),
			contrastCurve: (e) => e.platform === "phone" ? Q(6) : Q(7)
		});
		return q(super.onTertiaryContainer(), "2025", e);
	}
	tertiaryFixed() {
		let e = J.fromPalette({
			name: "tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => {
				let t = Object.assign({}, e, {
					isDark: !1,
					contrastLevel: 0
				});
				return this.tertiaryContainer().getTone(t);
			},
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? Q(1.5) : void 0
		});
		return q(super.tertiaryFixed(), "2025", e);
	}
	tertiaryFixedDim() {
		let e = J.fromPalette({
			name: "tertiary_fixed_dim",
			palette: (e) => e.tertiaryPalette,
			tone: (e) => this.tertiaryFixed().getTone(e),
			isBackground: !0,
			toneDeltaPair: (e) => new jg(this.tertiaryFixedDim(), this.tertiaryFixed(), 5, "darker", !0, "exact")
		});
		return q(super.tertiaryFixedDim(), "2025", e);
	}
	onTertiaryFixed() {
		let e = J.fromPalette({
			name: "on_tertiary_fixed",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixedDim(),
			contrastCurve: (e) => Q(7)
		});
		return q(super.onTertiaryFixed(), "2025", e);
	}
	onTertiaryFixedVariant() {
		let e = J.fromPalette({
			name: "on_tertiary_fixed_variant",
			palette: (e) => e.tertiaryPalette,
			background: (e) => this.tertiaryFixedDim(),
			contrastCurve: (e) => Q(4.5)
		});
		return q(super.onTertiaryFixedVariant(), "2025", e);
	}
	error() {
		let e = J.fromPalette({
			name: "error",
			palette: (e) => e.errorPalette,
			tone: (e) => e.platform === "phone" ? e.isDark ? Lg(e.errorPalette, 0, 98) : Ig(e.errorPalette) : Lg(e.errorPalette),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : this.surfaceContainerHigh(),
			contrastCurve: (e) => e.platform === "phone" ? Q(4.5) : Q(7),
			toneDeltaPair: (e) => e.platform === "phone" ? new jg(this.errorContainer(), this.error(), 5, "relative_lighter", !0, "farther") : void 0
		});
		return q(super.error(), "2025", e);
	}
	errorDim() {
		return J.fromPalette({
			name: "error_dim",
			palette: (e) => e.errorPalette,
			tone: (e) => Lg(e.errorPalette),
			isBackground: !0,
			background: (e) => this.surfaceContainerHigh(),
			contrastCurve: (e) => Q(4.5),
			toneDeltaPair: (e) => new jg(this.errorDim(), this.error(), 5, "darker", !0, "farther")
		});
	}
	onError() {
		let e = J.fromPalette({
			name: "on_error",
			palette: (e) => e.errorPalette,
			background: (e) => e.platform === "phone" ? this.error() : this.errorDim(),
			contrastCurve: (e) => e.platform === "phone" ? Q(6) : Q(7)
		});
		return q(super.onError(), "2025", e);
	}
	errorContainer() {
		let e = J.fromPalette({
			name: "error_container",
			palette: (e) => e.errorPalette,
			tone: (e) => e.platform === "watch" ? 30 : e.isDark ? Lg(e.errorPalette, 30, 93) : Ig(e.errorPalette, 0, 90),
			isBackground: !0,
			background: (e) => e.platform === "phone" ? this.highestSurface(e) : void 0,
			toneDeltaPair: (e) => e.platform === "watch" ? new jg(this.errorContainer(), this.errorDim(), 10, "darker", !0, "farther") : void 0,
			contrastCurve: (e) => e.platform === "phone" && e.contrastLevel > 0 ? Q(1.5) : void 0
		});
		return q(super.errorContainer(), "2025", e);
	}
	onErrorContainer() {
		let e = J.fromPalette({
			name: "on_error_container",
			palette: (e) => e.errorPalette,
			background: (e) => this.errorContainer(),
			contrastCurve: (e) => e.platform === "phone" ? Q(4.5) : Q(7)
		});
		return q(super.onErrorContainer(), "2025", e);
	}
	surfaceVariant() {
		let e = Object.assign(this.surfaceContainerHighest().clone(), { name: "surface_variant" });
		return q(super.surfaceVariant(), "2025", e);
	}
	surfaceTint() {
		let e = Object.assign(this.primary().clone(), { name: "surface_tint" });
		return q(super.surfaceTint(), "2025", e);
	}
	background() {
		let e = Object.assign(this.surface().clone(), { name: "background" });
		return q(super.background(), "2025", e);
	}
	onBackground() {
		let e = Object.assign(this.onSurface().clone(), {
			name: "on_background",
			tone: (e) => e.platform === "watch" ? 100 : this.onSurface().getTone(e)
		});
		return q(super.onBackground(), "2025", e);
	}
}, $ = class e {
	constructor() {
		this.allColors = [
			this.background(),
			this.onBackground(),
			this.surface(),
			this.surfaceDim(),
			this.surfaceBright(),
			this.surfaceContainerLowest(),
			this.surfaceContainerLow(),
			this.surfaceContainer(),
			this.surfaceContainerHigh(),
			this.surfaceContainerHighest(),
			this.onSurface(),
			this.onSurfaceVariant(),
			this.outline(),
			this.outlineVariant(),
			this.inverseSurface(),
			this.inverseOnSurface(),
			this.primary(),
			this.primaryDim(),
			this.onPrimary(),
			this.primaryContainer(),
			this.onPrimaryContainer(),
			this.primaryFixed(),
			this.primaryFixedDim(),
			this.onPrimaryFixed(),
			this.onPrimaryFixedVariant(),
			this.inversePrimary(),
			this.secondary(),
			this.secondaryDim(),
			this.onSecondary(),
			this.secondaryContainer(),
			this.onSecondaryContainer(),
			this.secondaryFixed(),
			this.secondaryFixedDim(),
			this.onSecondaryFixed(),
			this.onSecondaryFixedVariant(),
			this.tertiary(),
			this.tertiaryDim(),
			this.onTertiary(),
			this.tertiaryContainer(),
			this.onTertiaryContainer(),
			this.tertiaryFixed(),
			this.tertiaryFixedDim(),
			this.onTertiaryFixed(),
			this.onTertiaryFixedVariant(),
			this.error(),
			this.errorDim(),
			this.onError(),
			this.errorContainer(),
			this.onErrorContainer()
		].filter((e) => e !== void 0);
	}
	highestSurface(t) {
		return e.colorSpec.highestSurface(t);
	}
	primaryPaletteKeyColor() {
		return e.colorSpec.primaryPaletteKeyColor();
	}
	secondaryPaletteKeyColor() {
		return e.colorSpec.secondaryPaletteKeyColor();
	}
	tertiaryPaletteKeyColor() {
		return e.colorSpec.tertiaryPaletteKeyColor();
	}
	neutralPaletteKeyColor() {
		return e.colorSpec.neutralPaletteKeyColor();
	}
	neutralVariantPaletteKeyColor() {
		return e.colorSpec.neutralVariantPaletteKeyColor();
	}
	errorPaletteKeyColor() {
		return e.colorSpec.errorPaletteKeyColor();
	}
	background() {
		return e.colorSpec.background();
	}
	onBackground() {
		return e.colorSpec.onBackground();
	}
	surface() {
		return e.colorSpec.surface();
	}
	surfaceDim() {
		return e.colorSpec.surfaceDim();
	}
	surfaceBright() {
		return e.colorSpec.surfaceBright();
	}
	surfaceContainerLowest() {
		return e.colorSpec.surfaceContainerLowest();
	}
	surfaceContainerLow() {
		return e.colorSpec.surfaceContainerLow();
	}
	surfaceContainer() {
		return e.colorSpec.surfaceContainer();
	}
	surfaceContainerHigh() {
		return e.colorSpec.surfaceContainerHigh();
	}
	surfaceContainerHighest() {
		return e.colorSpec.surfaceContainerHighest();
	}
	onSurface() {
		return e.colorSpec.onSurface();
	}
	surfaceVariant() {
		return e.colorSpec.surfaceVariant();
	}
	onSurfaceVariant() {
		return e.colorSpec.onSurfaceVariant();
	}
	outline() {
		return e.colorSpec.outline();
	}
	outlineVariant() {
		return e.colorSpec.outlineVariant();
	}
	inverseSurface() {
		return e.colorSpec.inverseSurface();
	}
	inverseOnSurface() {
		return e.colorSpec.inverseOnSurface();
	}
	shadow() {
		return e.colorSpec.shadow();
	}
	scrim() {
		return e.colorSpec.scrim();
	}
	surfaceTint() {
		return e.colorSpec.surfaceTint();
	}
	primary() {
		return e.colorSpec.primary();
	}
	primaryDim() {
		return e.colorSpec.primaryDim();
	}
	onPrimary() {
		return e.colorSpec.onPrimary();
	}
	primaryContainer() {
		return e.colorSpec.primaryContainer();
	}
	onPrimaryContainer() {
		return e.colorSpec.onPrimaryContainer();
	}
	inversePrimary() {
		return e.colorSpec.inversePrimary();
	}
	primaryFixed() {
		return e.colorSpec.primaryFixed();
	}
	primaryFixedDim() {
		return e.colorSpec.primaryFixedDim();
	}
	onPrimaryFixed() {
		return e.colorSpec.onPrimaryFixed();
	}
	onPrimaryFixedVariant() {
		return e.colorSpec.onPrimaryFixedVariant();
	}
	secondary() {
		return e.colorSpec.secondary();
	}
	secondaryDim() {
		return e.colorSpec.secondaryDim();
	}
	onSecondary() {
		return e.colorSpec.onSecondary();
	}
	secondaryContainer() {
		return e.colorSpec.secondaryContainer();
	}
	onSecondaryContainer() {
		return e.colorSpec.onSecondaryContainer();
	}
	secondaryFixed() {
		return e.colorSpec.secondaryFixed();
	}
	secondaryFixedDim() {
		return e.colorSpec.secondaryFixedDim();
	}
	onSecondaryFixed() {
		return e.colorSpec.onSecondaryFixed();
	}
	onSecondaryFixedVariant() {
		return e.colorSpec.onSecondaryFixedVariant();
	}
	tertiary() {
		return e.colorSpec.tertiary();
	}
	tertiaryDim() {
		return e.colorSpec.tertiaryDim();
	}
	onTertiary() {
		return e.colorSpec.onTertiary();
	}
	tertiaryContainer() {
		return e.colorSpec.tertiaryContainer();
	}
	onTertiaryContainer() {
		return e.colorSpec.onTertiaryContainer();
	}
	tertiaryFixed() {
		return e.colorSpec.tertiaryFixed();
	}
	tertiaryFixedDim() {
		return e.colorSpec.tertiaryFixedDim();
	}
	onTertiaryFixed() {
		return e.colorSpec.onTertiaryFixed();
	}
	onTertiaryFixedVariant() {
		return e.colorSpec.onTertiaryFixedVariant();
	}
	error() {
		return e.colorSpec.error();
	}
	errorDim() {
		return e.colorSpec.errorDim();
	}
	onError() {
		return e.colorSpec.onError();
	}
	errorContainer() {
		return e.colorSpec.errorContainer();
	}
	onErrorContainer() {
		return e.colorSpec.onErrorContainer();
	}
	static highestSurface(t) {
		return e.colorSpec.highestSurface(t);
	}
};
$.contentAccentToneDelta = 15, $.colorSpec = new zg(), $.primaryPaletteKeyColor = $.colorSpec.primaryPaletteKeyColor(), $.secondaryPaletteKeyColor = $.colorSpec.secondaryPaletteKeyColor(), $.tertiaryPaletteKeyColor = $.colorSpec.tertiaryPaletteKeyColor(), $.neutralPaletteKeyColor = $.colorSpec.neutralPaletteKeyColor(), $.neutralVariantPaletteKeyColor = $.colorSpec.neutralVariantPaletteKeyColor(), $.background = $.colorSpec.background(), $.onBackground = $.colorSpec.onBackground(), $.surface = $.colorSpec.surface(), $.surfaceDim = $.colorSpec.surfaceDim(), $.surfaceBright = $.colorSpec.surfaceBright(), $.surfaceContainerLowest = $.colorSpec.surfaceContainerLowest(), $.surfaceContainerLow = $.colorSpec.surfaceContainerLow(), $.surfaceContainer = $.colorSpec.surfaceContainer(), $.surfaceContainerHigh = $.colorSpec.surfaceContainerHigh(), $.surfaceContainerHighest = $.colorSpec.surfaceContainerHighest(), $.onSurface = $.colorSpec.onSurface(), $.surfaceVariant = $.colorSpec.surfaceVariant(), $.onSurfaceVariant = $.colorSpec.onSurfaceVariant(), $.inverseSurface = $.colorSpec.inverseSurface(), $.inverseOnSurface = $.colorSpec.inverseOnSurface(), $.outline = $.colorSpec.outline(), $.outlineVariant = $.colorSpec.outlineVariant(), $.shadow = $.colorSpec.shadow(), $.scrim = $.colorSpec.scrim(), $.surfaceTint = $.colorSpec.surfaceTint(), $.primary = $.colorSpec.primary(), $.onPrimary = $.colorSpec.onPrimary(), $.primaryContainer = $.colorSpec.primaryContainer(), $.onPrimaryContainer = $.colorSpec.onPrimaryContainer(), $.inversePrimary = $.colorSpec.inversePrimary(), $.secondary = $.colorSpec.secondary(), $.onSecondary = $.colorSpec.onSecondary(), $.secondaryContainer = $.colorSpec.secondaryContainer(), $.onSecondaryContainer = $.colorSpec.onSecondaryContainer(), $.tertiary = $.colorSpec.tertiary(), $.onTertiary = $.colorSpec.onTertiary(), $.tertiaryContainer = $.colorSpec.tertiaryContainer(), $.onTertiaryContainer = $.colorSpec.onTertiaryContainer(), $.error = $.colorSpec.error(), $.onError = $.colorSpec.onError(), $.errorContainer = $.colorSpec.errorContainer(), $.onErrorContainer = $.colorSpec.onErrorContainer(), $.primaryFixed = $.colorSpec.primaryFixed(), $.primaryFixedDim = $.colorSpec.primaryFixedDim(), $.onPrimaryFixed = $.colorSpec.onPrimaryFixed(), $.onPrimaryFixedVariant = $.colorSpec.onPrimaryFixedVariant(), $.secondaryFixed = $.colorSpec.secondaryFixed(), $.secondaryFixedDim = $.colorSpec.secondaryFixedDim(), $.onSecondaryFixed = $.colorSpec.onSecondaryFixed(), $.onSecondaryFixedVariant = $.colorSpec.onSecondaryFixedVariant(), $.tertiaryFixed = $.colorSpec.tertiaryFixed(), $.tertiaryFixedDim = $.colorSpec.tertiaryFixedDim(), $.onTertiaryFixed = $.colorSpec.onTertiaryFixed(), $.onTertiaryFixedVariant = $.colorSpec.onTertiaryFixedVariant();
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/dynamiccolor/dynamic_scheme.js
var Bg = class e {
	static maybeFallbackSpecVersion(e, t) {
		switch (t) {
			case Z.EXPRESSIVE:
			case Z.VIBRANT:
			case Z.TONAL_SPOT:
			case Z.NEUTRAL: return e;
			default: return "2021";
		}
	}
	constructor(t) {
		this.sourceColorArgb = t.sourceColorHct.toInt(), this.variant = t.variant, this.contrastLevel = t.contrastLevel, this.isDark = t.isDark, this.platform = t.platform ?? "phone", this.specVersion = e.maybeFallbackSpecVersion(t.specVersion ?? "2021", this.variant), this.sourceColorHct = t.sourceColorHct, this.primaryPalette = t.primaryPalette ?? Gg(this.specVersion).getPrimaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.secondaryPalette = t.secondaryPalette ?? Gg(this.specVersion).getSecondaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.tertiaryPalette = t.tertiaryPalette ?? Gg(this.specVersion).getTertiaryPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.neutralPalette = t.neutralPalette ?? Gg(this.specVersion).getNeutralPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.neutralVariantPalette = t.neutralVariantPalette ?? Gg(this.specVersion).getNeutralVariantPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel), this.errorPalette = t.errorPalette ?? Gg(this.specVersion).getErrorPalette(this.variant, t.sourceColorHct, this.isDark, this.platform, this.contrastLevel) ?? Y.fromHueAndChroma(25, 84), this.colors = new $();
	}
	toString() {
		return `Scheme: variant=${Z[this.variant]}, mode=${this.isDark ? "dark" : "light"}, platform=${this.platform}, contrastLevel=${this.contrastLevel.toFixed(1)}, seed=${this.sourceColorHct.toString()}, specVersion=${this.specVersion}`;
	}
	static getPiecewiseHue(e, t, n) {
		let r = Math.min(t.length - 1, n.length), i = e.hue;
		for (let e = 0; e < r; e++) if (i >= t[e] && i < t[e + 1]) return Jh(n[e]);
		return i;
	}
	static getRotatedHue(t, n, r) {
		let i = e.getPiecewiseHue(t, n, r);
		return Math.min(n.length - 1, r.length) <= 0 && (i = 0), Jh(t.hue + i);
	}
	getArgb(e) {
		return e.getArgb(this);
	}
	getHct(e) {
		return e.getHct(this);
	}
	get primaryPaletteKeyColor() {
		return this.getArgb(this.colors.primaryPaletteKeyColor());
	}
	get secondaryPaletteKeyColor() {
		return this.getArgb(this.colors.secondaryPaletteKeyColor());
	}
	get tertiaryPaletteKeyColor() {
		return this.getArgb(this.colors.tertiaryPaletteKeyColor());
	}
	get neutralPaletteKeyColor() {
		return this.getArgb(this.colors.neutralPaletteKeyColor());
	}
	get neutralVariantPaletteKeyColor() {
		return this.getArgb(this.colors.neutralVariantPaletteKeyColor());
	}
	get errorPaletteKeyColor() {
		return this.getArgb(this.colors.errorPaletteKeyColor());
	}
	get background() {
		return this.getArgb(this.colors.background());
	}
	get onBackground() {
		return this.getArgb(this.colors.onBackground());
	}
	get surface() {
		return this.getArgb(this.colors.surface());
	}
	get surfaceDim() {
		return this.getArgb(this.colors.surfaceDim());
	}
	get surfaceBright() {
		return this.getArgb(this.colors.surfaceBright());
	}
	get surfaceContainerLowest() {
		return this.getArgb(this.colors.surfaceContainerLowest());
	}
	get surfaceContainerLow() {
		return this.getArgb(this.colors.surfaceContainerLow());
	}
	get surfaceContainer() {
		return this.getArgb(this.colors.surfaceContainer());
	}
	get surfaceContainerHigh() {
		return this.getArgb(this.colors.surfaceContainerHigh());
	}
	get surfaceContainerHighest() {
		return this.getArgb(this.colors.surfaceContainerHighest());
	}
	get onSurface() {
		return this.getArgb(this.colors.onSurface());
	}
	get surfaceVariant() {
		return this.getArgb(this.colors.surfaceVariant());
	}
	get onSurfaceVariant() {
		return this.getArgb(this.colors.onSurfaceVariant());
	}
	get inverseSurface() {
		return this.getArgb(this.colors.inverseSurface());
	}
	get inverseOnSurface() {
		return this.getArgb(this.colors.inverseOnSurface());
	}
	get outline() {
		return this.getArgb(this.colors.outline());
	}
	get outlineVariant() {
		return this.getArgb(this.colors.outlineVariant());
	}
	get shadow() {
		return this.getArgb(this.colors.shadow());
	}
	get scrim() {
		return this.getArgb(this.colors.scrim());
	}
	get surfaceTint() {
		return this.getArgb(this.colors.surfaceTint());
	}
	get primary() {
		return this.getArgb(this.colors.primary());
	}
	get primaryDim() {
		let e = this.colors.primaryDim();
		if (e === void 0) throw Error("`primaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onPrimary() {
		return this.getArgb(this.colors.onPrimary());
	}
	get primaryContainer() {
		return this.getArgb(this.colors.primaryContainer());
	}
	get onPrimaryContainer() {
		return this.getArgb(this.colors.onPrimaryContainer());
	}
	get primaryFixed() {
		return this.getArgb(this.colors.primaryFixed());
	}
	get primaryFixedDim() {
		return this.getArgb(this.colors.primaryFixedDim());
	}
	get onPrimaryFixed() {
		return this.getArgb(this.colors.onPrimaryFixed());
	}
	get onPrimaryFixedVariant() {
		return this.getArgb(this.colors.onPrimaryFixedVariant());
	}
	get inversePrimary() {
		return this.getArgb(this.colors.inversePrimary());
	}
	get secondary() {
		return this.getArgb(this.colors.secondary());
	}
	get secondaryDim() {
		let e = this.colors.secondaryDim();
		if (e === void 0) throw Error("`secondaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onSecondary() {
		return this.getArgb(this.colors.onSecondary());
	}
	get secondaryContainer() {
		return this.getArgb(this.colors.secondaryContainer());
	}
	get onSecondaryContainer() {
		return this.getArgb(this.colors.onSecondaryContainer());
	}
	get secondaryFixed() {
		return this.getArgb(this.colors.secondaryFixed());
	}
	get secondaryFixedDim() {
		return this.getArgb(this.colors.secondaryFixedDim());
	}
	get onSecondaryFixed() {
		return this.getArgb(this.colors.onSecondaryFixed());
	}
	get onSecondaryFixedVariant() {
		return this.getArgb(this.colors.onSecondaryFixedVariant());
	}
	get tertiary() {
		return this.getArgb(this.colors.tertiary());
	}
	get tertiaryDim() {
		let e = this.colors.tertiaryDim();
		if (e === void 0) throw Error("`tertiaryDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onTertiary() {
		return this.getArgb(this.colors.onTertiary());
	}
	get tertiaryContainer() {
		return this.getArgb(this.colors.tertiaryContainer());
	}
	get onTertiaryContainer() {
		return this.getArgb(this.colors.onTertiaryContainer());
	}
	get tertiaryFixed() {
		return this.getArgb(this.colors.tertiaryFixed());
	}
	get tertiaryFixedDim() {
		return this.getArgb(this.colors.tertiaryFixedDim());
	}
	get onTertiaryFixed() {
		return this.getArgb(this.colors.onTertiaryFixed());
	}
	get onTertiaryFixedVariant() {
		return this.getArgb(this.colors.onTertiaryFixedVariant());
	}
	get error() {
		return this.getArgb(this.colors.error());
	}
	get errorDim() {
		let e = this.colors.errorDim();
		if (e === void 0) throw Error("`errorDim` color is undefined prior to 2025 spec.");
		return this.getArgb(e);
	}
	get onError() {
		return this.getArgb(this.colors.onError());
	}
	get errorContainer() {
		return this.getArgb(this.colors.errorContainer());
	}
	get onErrorContainer() {
		return this.getArgb(this.colors.onErrorContainer());
	}
};
Bg.DEFAULT_SPEC_VERSION = "2021", Bg.DEFAULT_PLATFORM = "phone";
var Vg = class {
	getPrimaryPalette(e, t, n, r, i) {
		switch (e) {
			case Z.CONTENT:
			case Z.FIDELITY: return Y.fromHueAndChroma(t.hue, t.chroma);
			case Z.FRUIT_SALAD: return Y.fromHueAndChroma(Jh(t.hue - 50), 48);
			case Z.MONOCHROME: return Y.fromHueAndChroma(t.hue, 0);
			case Z.NEUTRAL: return Y.fromHueAndChroma(t.hue, 12);
			case Z.RAINBOW: return Y.fromHueAndChroma(t.hue, 48);
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(t.hue, 36);
			case Z.EXPRESSIVE: return Y.fromHueAndChroma(Jh(t.hue + 240), 40);
			case Z.VIBRANT: return Y.fromHueAndChroma(t.hue, 200);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getSecondaryPalette(e, t, n, r, i) {
		switch (e) {
			case Z.CONTENT:
			case Z.FIDELITY: return Y.fromHueAndChroma(t.hue, Math.max(t.chroma - 32, t.chroma * .5));
			case Z.FRUIT_SALAD: return Y.fromHueAndChroma(Jh(t.hue - 50), 36);
			case Z.MONOCHROME: return Y.fromHueAndChroma(t.hue, 0);
			case Z.NEUTRAL: return Y.fromHueAndChroma(t.hue, 8);
			case Z.RAINBOW: return Y.fromHueAndChroma(t.hue, 16);
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(t.hue, 16);
			case Z.EXPRESSIVE: return Y.fromHueAndChroma(Bg.getRotatedHue(t, [
				0,
				21,
				51,
				121,
				151,
				191,
				271,
				321,
				360
			], [
				45,
				95,
				45,
				20,
				45,
				90,
				45,
				45,
				45
			]), 24);
			case Z.VIBRANT: return Y.fromHueAndChroma(Bg.getRotatedHue(t, [
				0,
				41,
				61,
				101,
				131,
				181,
				251,
				301,
				360
			], [
				18,
				15,
				10,
				12,
				15,
				18,
				15,
				12,
				12
			]), 24);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getTertiaryPalette(e, t, n, r, i) {
		switch (e) {
			case Z.CONTENT: return Y.fromHct(Sg.fixIfDisliked(new Ag(t).analogous(3, 6)[2]));
			case Z.FIDELITY: return Y.fromHct(Sg.fixIfDisliked(new Ag(t).complement));
			case Z.FRUIT_SALAD: return Y.fromHueAndChroma(t.hue, 36);
			case Z.MONOCHROME: return Y.fromHueAndChroma(t.hue, 0);
			case Z.NEUTRAL: return Y.fromHueAndChroma(t.hue, 16);
			case Z.RAINBOW:
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(Jh(t.hue + 60), 24);
			case Z.EXPRESSIVE: return Y.fromHueAndChroma(Bg.getRotatedHue(t, [
				0,
				21,
				51,
				121,
				151,
				191,
				271,
				321,
				360
			], [
				120,
				120,
				20,
				45,
				20,
				15,
				20,
				120,
				120
			]), 32);
			case Z.VIBRANT: return Y.fromHueAndChroma(Bg.getRotatedHue(t, [
				0,
				41,
				61,
				101,
				131,
				181,
				251,
				301,
				360
			], [
				35,
				30,
				20,
				25,
				30,
				35,
				30,
				25,
				25
			]), 32);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getNeutralPalette(e, t, n, r, i) {
		switch (e) {
			case Z.CONTENT:
			case Z.FIDELITY: return Y.fromHueAndChroma(t.hue, t.chroma / 8);
			case Z.FRUIT_SALAD: return Y.fromHueAndChroma(t.hue, 10);
			case Z.MONOCHROME: return Y.fromHueAndChroma(t.hue, 0);
			case Z.NEUTRAL: return Y.fromHueAndChroma(t.hue, 2);
			case Z.RAINBOW: return Y.fromHueAndChroma(t.hue, 0);
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(t.hue, 6);
			case Z.EXPRESSIVE: return Y.fromHueAndChroma(Jh(t.hue + 15), 8);
			case Z.VIBRANT: return Y.fromHueAndChroma(t.hue, 10);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getNeutralVariantPalette(e, t, n, r, i) {
		switch (e) {
			case Z.CONTENT: return Y.fromHueAndChroma(t.hue, t.chroma / 8 + 4);
			case Z.FIDELITY: return Y.fromHueAndChroma(t.hue, t.chroma / 8 + 4);
			case Z.FRUIT_SALAD: return Y.fromHueAndChroma(t.hue, 16);
			case Z.MONOCHROME: return Y.fromHueAndChroma(t.hue, 0);
			case Z.NEUTRAL: return Y.fromHueAndChroma(t.hue, 2);
			case Z.RAINBOW: return Y.fromHueAndChroma(t.hue, 0);
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(t.hue, 8);
			case Z.EXPRESSIVE: return Y.fromHueAndChroma(Jh(t.hue + 15), 12);
			case Z.VIBRANT: return Y.fromHueAndChroma(t.hue, 12);
			default: throw Error(`Unsupported variant: ${e}`);
		}
	}
	getErrorPalette(e, t, n, r, i) {}
}, Hg = class e extends Vg {
	getPrimaryPalette(e, t, n, r, i) {
		switch (e) {
			case Z.NEUTRAL: return Y.fromHueAndChroma(t.hue, r === "phone" ? bg.isBlue(t.hue) ? 12 : 8 : bg.isBlue(t.hue) ? 16 : 12);
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(t.hue, r === "phone" && n ? 26 : 32);
			case Z.EXPRESSIVE: return Y.fromHueAndChroma(t.hue, r === "phone" ? n ? 36 : 48 : 40);
			case Z.VIBRANT: return Y.fromHueAndChroma(t.hue, r === "phone" ? 74 : 56);
			default: return super.getPrimaryPalette(e, t, n, r, i);
		}
	}
	getSecondaryPalette(e, t, n, r, i) {
		switch (e) {
			case Z.NEUTRAL: return Y.fromHueAndChroma(t.hue, r === "phone" ? bg.isBlue(t.hue) ? 6 : 4 : bg.isBlue(t.hue) ? 10 : 6);
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(t.hue, 16);
			case Z.EXPRESSIVE: return Y.fromHueAndChroma(Bg.getRotatedHue(t, [
				0,
				105,
				140,
				204,
				253,
				278,
				300,
				333,
				360
			], [
				-160,
				155,
				-100,
				96,
				-96,
				-156,
				-165,
				-160
			]), r === "phone" && n ? 16 : 24);
			case Z.VIBRANT: return Y.fromHueAndChroma(Bg.getRotatedHue(t, [
				0,
				38,
				105,
				140,
				333,
				360
			], [
				-14,
				10,
				-14,
				10,
				-14
			]), r === "phone" ? 56 : 36);
			default: return super.getSecondaryPalette(e, t, n, r, i);
		}
	}
	getTertiaryPalette(e, t, n, r, i) {
		switch (e) {
			case Z.NEUTRAL: return Y.fromHueAndChroma(Bg.getRotatedHue(t, [
				0,
				38,
				105,
				161,
				204,
				278,
				333,
				360
			], [
				-32,
				26,
				10,
				-39,
				24,
				-15,
				-32
			]), r === "phone" ? 20 : 36);
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(Bg.getRotatedHue(t, [
				0,
				20,
				71,
				161,
				333,
				360
			], [
				-40,
				48,
				-32,
				40,
				-32
			]), r === "phone" ? 28 : 32);
			case Z.EXPRESSIVE: return Y.fromHueAndChroma(Bg.getRotatedHue(t, [
				0,
				105,
				140,
				204,
				253,
				278,
				300,
				333,
				360
			], [
				-165,
				160,
				-105,
				101,
				-101,
				-160,
				-170,
				-165
			]), 48);
			case Z.VIBRANT: return Y.fromHueAndChroma(Bg.getRotatedHue(t, [
				0,
				38,
				71,
				105,
				140,
				161,
				253,
				333,
				360
			], [
				-72,
				35,
				24,
				-24,
				62,
				50,
				62,
				-72
			]), 56);
			default: return super.getTertiaryPalette(e, t, n, r, i);
		}
	}
	static getExpressiveNeutralHue(e) {
		return Bg.getRotatedHue(e, [
			0,
			71,
			124,
			253,
			278,
			300,
			360
		], [
			10,
			0,
			10,
			0,
			10,
			0
		]);
	}
	static getExpressiveNeutralChroma(t, n, r) {
		let i = e.getExpressiveNeutralHue(t);
		return r === "phone" ? n ? bg.isYellow(i) ? 6 : 14 : 18 : 12;
	}
	static getVibrantNeutralHue(e) {
		return Bg.getRotatedHue(e, [
			0,
			38,
			105,
			140,
			333,
			360
		], [
			-14,
			10,
			-14,
			10,
			-14
		]);
	}
	static getVibrantNeutralChroma(t, n) {
		let r = e.getVibrantNeutralHue(t);
		return n === "phone" || bg.isBlue(r) ? 28 : 20;
	}
	getNeutralPalette(t, n, r, i, a) {
		switch (t) {
			case Z.NEUTRAL: return Y.fromHueAndChroma(n.hue, i === "phone" ? 1.4 : 6);
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(n.hue, i === "phone" ? 5 : 10);
			case Z.EXPRESSIVE: return Y.fromHueAndChroma(e.getExpressiveNeutralHue(n), e.getExpressiveNeutralChroma(n, r, i));
			case Z.VIBRANT: return Y.fromHueAndChroma(e.getVibrantNeutralHue(n), e.getVibrantNeutralChroma(n, i));
			default: return super.getNeutralPalette(t, n, r, i, a);
		}
	}
	getNeutralVariantPalette(t, n, r, i, a) {
		switch (t) {
			case Z.NEUTRAL: return Y.fromHueAndChroma(n.hue, (i === "phone" ? 1.4 : 6) * 2.2);
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(n.hue, (i === "phone" ? 5 : 10) * 1.7);
			case Z.EXPRESSIVE:
				let o = e.getExpressiveNeutralHue(n), s = e.getExpressiveNeutralChroma(n, r, i);
				return Y.fromHueAndChroma(o, s * (o >= 105 && o < 125 ? 1.6 : 2.3));
			case Z.VIBRANT:
				let c = e.getVibrantNeutralHue(n), l = e.getVibrantNeutralChroma(n, i);
				return Y.fromHueAndChroma(c, l * 1.29);
			default: return super.getNeutralVariantPalette(t, n, r, i, a);
		}
	}
	getErrorPalette(e, t, n, r, i) {
		let a = Bg.getPiecewiseHue(t, [
			0,
			3,
			13,
			23,
			33,
			43,
			153,
			273,
			360
		], [
			12,
			22,
			32,
			12,
			22,
			32,
			22,
			12
		]);
		switch (e) {
			case Z.NEUTRAL: return Y.fromHueAndChroma(a, r === "phone" ? 50 : 40);
			case Z.TONAL_SPOT: return Y.fromHueAndChroma(a, r === "phone" ? 60 : 48);
			case Z.EXPRESSIVE: return Y.fromHueAndChroma(a, r === "phone" ? 64 : 48);
			case Z.VIBRANT: return Y.fromHueAndChroma(a, r === "phone" ? 80 : 60);
			default: return super.getErrorPalette(e, t, n, r, i);
		}
	}
}, Ug = new Vg(), Wg = new Hg();
function Gg(e) {
	return e === "2025" ? Wg : Ug;
}
//#endregion
//#region node_modules/.pnpm/@material+material-color-utilities@0.4.0/node_modules/@material/material-color-utilities/score/score.js
var Kg = {
	desired: 4,
	fallbackColorARGB: 4282549748,
	filter: !0
};
function qg(e, t) {
	return e.score > t.score ? -1 : +(e.score < t.score);
}
var Jg = class e {
	constructor() {}
	static score(t, n) {
		let { desired: r, fallbackColorARGB: i, filter: a } = {
			...Kg,
			...n
		}, o = [], s = Array(360).fill(0), c = 0;
		for (let [e, n] of t.entries()) {
			let t = bg.fromInt(e);
			o.push(t);
			let r = Math.floor(t.hue);
			s[r] += n, c += n;
		}
		let l = Array(360).fill(0);
		for (let e = 0; e < 360; e++) {
			let t = s[e] / c;
			for (let n = e - 14; n < e + 16; n++) {
				let e = qh(n);
				l[e] += t;
			}
		}
		let u = [];
		for (let t of o) {
			let n = l[qh(Math.round(t.hue))];
			if (a && (t.chroma < e.CUTOFF_CHROMA || n <= e.CUTOFF_EXCITED_PROPORTION)) continue;
			let r = n * 100 * e.WEIGHT_PROPORTION, i = t.chroma < e.TARGET_CHROMA ? e.WEIGHT_CHROMA_BELOW : e.WEIGHT_CHROMA_ABOVE, o = r + (t.chroma - e.TARGET_CHROMA) * i;
			u.push({
				hct: t,
				score: o
			});
		}
		u.sort(qg);
		let d = [];
		for (let e = 90; e >= 15; e--) {
			d.length = 0;
			for (let { hct: t } of u) if (d.find((n) => Yh(t.hue, n.hue) < e) || d.push(t), d.length >= r) break;
			if (d.length >= r) break;
		}
		let f = [];
		d.length === 0 && f.push(i);
		for (let e of d) f.push(e.toInt());
		return f;
	}
};
Jg.TARGET_CHROMA = 48, Jg.WEIGHT_PROPORTION = .7, Jg.WEIGHT_CHROMA_ABOVE = .3, Jg.WEIGHT_CHROMA_BELOW = .1, Jg.CUTOFF_CHROMA = 5, Jg.CUTOFF_EXCITED_PROPORTION = .01;
//#endregion
//#region src/utils/material-color-helpers.ts
var Yg = new $(), Xg = {
	primary: Yg.primary(),
	"on-primary": Yg.onPrimary(),
	"primary-container": Yg.primaryContainer(),
	"on-primary-container": Yg.onPrimaryContainer(),
	secondary: Yg.secondary(),
	"on-secondary": Yg.onSecondary(),
	"secondary-container": Yg.secondaryContainer(),
	"on-secondary-container": Yg.onSecondaryContainer(),
	tertiary: Yg.tertiary(),
	"on-tertiary": Yg.onTertiary(),
	"tertiary-container": Yg.tertiaryContainer(),
	"on-tertiary-container": Yg.onTertiaryContainer(),
	error: Yg.error(),
	"on-error": Yg.onError(),
	"error-container": Yg.errorContainer(),
	"on-error-container": Yg.onErrorContainer(),
	background: Yg.background(),
	"on-background": Yg.onBackground(),
	surface: Yg.surface(),
	"on-surface": Yg.onSurface(),
	"surface-dim": Yg.surfaceDim(),
	"surface-bright": Yg.surfaceBright(),
	"surface-variant": Yg.surfaceVariant(),
	"on-surface-variant": Yg.onSurfaceVariant(),
	"surface-container-lowest": Yg.surfaceContainerLowest(),
	"surface-container-low": Yg.surfaceContainerLow(),
	"surface-container": Yg.surfaceContainer(),
	"surface-container-high": Yg.surfaceContainerHigh(),
	"surface-container-highest": Yg.surfaceContainerHighest(),
	outline: Yg.outline(),
	"outline-variant": Yg.outlineVariant(),
	shadow: Yg.shadow(),
	scrim: Yg.scrim()
};
Xg.primary, Xg["secondary-container"], Xg["tertiary-container"];
//#endregion
//#region src/utils/theme.ts
function Zg(e, t, n = "custom-theme") {
	e instanceof Document;
	let r = globalThis[n];
	r || (r = new CSSStyleSheet(), globalThis[n] = r, e.adoptedStyleSheets.push(r)), r.replaceSync(t);
}
//#endregion
//#region src/shared/browser.ts
async function Qg(e) {
	let t = await l.i18n.detectLanguage(e);
	return t.isReliable ? t.languages.sort((e, t) => t.percentage - e.percentage)[0].language : null;
}
//#endregion
//#region src/entrypoints/background/providers/browser.ts
async function $g() {
	if (typeof LanguageDetector > "u") return "not-implemented";
	try {
		return await LanguageDetector.availability({ expectedInputLanguages: [
			"en",
			"es",
			"fr",
			"de",
			"ru",
			"zh",
			"ja",
			"ko"
		] }) === "unavailable" ? "unavailable" : "available";
	} catch (e) {
		return console.debug(e), "not-implemented";
	}
}
async function e_() {
	if (typeof Translator > "u") return !1;
	try {
		return await Translator.availability({
			sourceLanguage: "en",
			targetLanguage: "es"
		}) === "unavailable" ? !1 : await $g() !== "unavailable";
	} catch (e) {
		return console.error("Error checking browser translation availability:", e), !1;
	}
}
//#endregion
//#region node_modules/.pnpm/runed@0.37.1_svelte@5.55.4_@typescript-eslint+types@8.58.2__zod@4.3.6/node_modules/runed/dist/internal/configurable-globals.js
var t_ = typeof window < "u" ? window : void 0;
typeof window < "u" && window.document, typeof window < "u" && window.navigator, typeof window < "u" && window.location;
//#endregion
//#region node_modules/.pnpm/runed@0.37.1_svelte@5.55.4_@typescript-eslint+types@8.58.2__zod@4.3.6/node_modules/runed/dist/internal/utils/dom.js
function n_(e) {
	let t = e.activeElement;
	for (; t?.shadowRoot;) {
		let e = t.shadowRoot.activeElement;
		if (e === t) break;
		t = e;
	}
	return t;
}
new class {
	#e;
	#t;
	constructor(e = {}) {
		let { window: t = t_, document: n = t?.document } = e;
		t !== void 0 && (this.#e = n, this.#t = Nn((e) => {
			let n = Fi(t, "focusin", e), r = Fi(t, "focusout", e);
			return () => {
				n(), r();
			};
		}));
	}
	get current() {
		return this.#t?.(), this.#e ? n_(this.#e) : null;
	}
}();
//#endregion
//#region node_modules/.pnpm/runed@0.37.1_svelte@5.55.4_@typescript-eslint+types@8.58.2__zod@4.3.6/node_modules/runed/dist/internal/utils/is.js
function r_(e) {
	return typeof e == "function";
}
//#endregion
//#region node_modules/.pnpm/runed@0.37.1_svelte@5.55.4_@typescript-eslint+types@8.58.2__zod@4.3.6/node_modules/runed/dist/utilities/extract/extract.svelte.js
function i_(e, t) {
	if (r_(e)) {
		let n = e();
		return n === void 0 ? t : n;
	}
	return e === void 0 ? t : e;
}
//#endregion
//#region node_modules/.pnpm/runed@0.37.1_svelte@5.55.4_@typescript-eslint+types@8.58.2__zod@4.3.6/node_modules/runed/dist/utilities/use-debounce/use-debounce.svelte.js
function a_(e, t) {
	let n = /* @__PURE__ */ O(null), r = /* @__PURE__ */ D(() => i_(t, 250));
	function i(...t) {
		if (P(n)) P(n).timeout && clearTimeout(P(n).timeout);
		else {
			let e, t;
			k(n, {
				timeout: null,
				runner: null,
				promise: new Promise((n, r) => {
					e = n, t = r;
				}),
				resolve: e,
				reject: t
			}, !0);
		}
		return P(n).runner = async () => {
			if (!P(n)) return;
			let r = P(n);
			k(n, null);
			try {
				r.resolve(await e.apply(this, t));
			} catch (e) {
				r.reject(e);
			}
		}, P(n).timeout = setTimeout(P(n).runner, P(r)), P(n).promise;
	}
	return i.cancel = async () => {
		(!P(n) || P(n).timeout === null) && (await new Promise((e) => setTimeout(e, 0)), !P(n) || P(n).timeout === null) || (clearTimeout(P(n).timeout), P(n).reject("Cancelled"), k(n, null));
	}, i.runScheduledNow = async () => {
		(!P(n) || !P(n).timeout) && (await new Promise((e) => setTimeout(e, 0)), !P(n) || !P(n).timeout) || (clearTimeout(P(n).timeout), P(n).timeout = null, await P(n).runner?.());
	}, Object.defineProperty(i, "pending", {
		enumerable: !0,
		get() {
			return !!P(n)?.timeout;
		}
	}), i;
}
//#endregion
//#region node_modules/.pnpm/runed@0.37.1_svelte@5.55.4_@typescript-eslint+types@8.58.2__zod@4.3.6/node_modules/runed/dist/utilities/watch/watch.svelte.js
function o_(e, t) {
	switch (e) {
		case "post":
			jr(t);
			break;
		case "pre":
			Nr(t);
			break;
	}
}
function s_(e, t, n, r = {}) {
	let { lazy: i = !1 } = r, a = !i, o = Array.isArray(e) ? [] : void 0;
	o_(t, () => {
		let t = Array.isArray(e) ? e.map((e) => e()) : e();
		if (!a) {
			a = !0, o = t;
			return;
		}
		let r = Oi(() => n(t, o));
		return o = t, r;
	});
}
function c_(e, t, n) {
	let r = Pr(() => {
		let i = !1;
		s_(e, t, (e, t) => {
			if (i) {
				r();
				return;
			}
			let a = n(e, t);
			return i = !0, a;
		}, { lazy: !0 });
	});
	jr(() => r);
}
function l_(e, t, n) {
	s_(e, "post", t, n);
}
function u_(e, t, n) {
	s_(e, "pre", t, n);
}
l_.pre = u_;
function d_(e, t) {
	c_(e, "post", t);
}
function f_(e, t) {
	c_(e, "pre", t);
}
d_.pre = f_;
//#endregion
//#region node_modules/.pnpm/runed@0.37.1_svelte@5.55.4_@typescript-eslint+types@8.58.2__zod@4.3.6/node_modules/runed/dist/utilities/resource/resource.svelte.js
function p_(e, t) {
	let n, r = null;
	return (...i) => new Promise((a) => {
		r && r(void 0), r = a, clearTimeout(n), n = setTimeout(async () => {
			let t = await e(...i);
			r &&= (r(t), null);
		}, t);
	});
}
function m_(e, t) {
	let n = 0, r = null;
	return (...i) => {
		let a = Date.now();
		return n && a - n < t ? r ?? Promise.resolve(void 0) : (n = a, r = e(...i), r);
	};
}
function h_(e, t, n = {}, r) {
	let { lazy: i = !1, once: a = !1, initialValue: o, debounce: s, throttle: c } = n, l = /* @__PURE__ */ O(ir(o)), u = /* @__PURE__ */ O(ir(o === void 0 && !i)), d = /* @__PURE__ */ O(void 0), f = /* @__PURE__ */ O(ir([])), p = () => {
		P(f).forEach((e) => e()), k(f, [], !0);
	}, m = (e) => {
		k(f, [...P(f), e], !0);
	}, h = async (e, n, r = !1) => {
		try {
			k(u, !0), k(d, void 0), p();
			let i = new AbortController();
			m(() => i.abort());
			let a = await t(e, n, {
				data: P(l),
				refetching: r,
				onCleanup: m,
				signal: i.signal
			});
			return k(l, a, !0), a;
		} catch (e) {
			e instanceof DOMException && e.name === "AbortError" || k(d, e, !0);
			return;
		} finally {
			k(u, !1);
		}
	}, g = s ? p_(h, s) : c ? m_(h, c) : h, _ = Array.isArray(e) ? e : [e], v;
	return r((t, n) => {
		a && v || (v = t, g(Array.isArray(e) ? t : t[0], Array.isArray(e) ? n : n?.[0]));
	}, { lazy: i }), {
		get current() {
			return P(l);
		},
		get loading() {
			return P(u);
		},
		get error() {
			return P(d);
		},
		mutate: (e) => {
			k(l, e, !0);
		},
		refetch: (t) => {
			let n = _.map((e) => e());
			return g(Array.isArray(e) ? n : n[0], Array.isArray(e) ? n : n[0], t ?? !0);
		}
	};
}
function g_(e, t, n) {
	return h_(e, t, n, (t, n) => {
		let r = Array.isArray(e) ? e : [e];
		l_(() => r.map((e) => e()), (e, n) => {
			t(e, n ?? []);
		}, n);
	});
}
function __(e, t, n) {
	return h_(e, t, n, (t, n) => {
		let r = Array.isArray(e) ? e : [e];
		l_.pre(() => r.map((e) => e()), (e, n) => {
			t(e, n ?? []);
		}, n);
	});
}
g_.pre = __;
//#endregion
//#region src/entrypoints/content/App.svelte
var v_ = /* @__PURE__ */ F("<div><!> <!></div>");
function y_(e, t) {
	Kt(t, !0);
	let n = /* @__PURE__ */ D(d), r = /* @__PURE__ */ D(() => W.isInTextField ? U.settings.textFieldButtonShow : U.settings.inlineButtonShow), i = /* @__PURE__ */ D(() => U.settings.blacklistDomainForInline.includes(W.hostname)), a = /* @__PURE__ */ D(() => !U.settings.showPopupOnSelection && !!W.selectedText && !!W.selectedEndCoord && P(r) && !P(i)), o = /* @__PURE__ */ D(() => U.settings.showPopupOnSelection ? 400 : 200), s = a_((e) => {
		e.closest("translator-content-app") || (W.selectedText = Bh(e), W.selectedElemRect = Vh(e), W.selectedEndCoord = Hh(e), W.isInTextField = zh(e), W.hostname = window.location.hostname, U.settings.showPopupOnSelection && W.selectedText && W.openPopup());
	}, () => P(o));
	function c(e) {
		if (e.button !== 0) return;
		let t = e.target;
		s(t);
	}
	function u(e) {
		let t = e.target;
		if (!zh(t)) return;
		let n = (e.ctrlKey || e.metaKey) && e.code === "KeyA", r = e.shiftKey && [
			"ArrowLeft",
			"ArrowRight",
			"ArrowUp",
			"ArrowDown",
			"Home",
			"End"
		].includes(e.key);
		!n && !r || s(t);
	}
	async function d() {
		if (!U.settings.hideButtonForUserLanguage) return !0;
		let e = await Qg(W.selectedText);
		return e ? !U.settings.targetLang.startsWith(e) : !0;
	}
	function f(e, t, n) {
		e.type === "ping" && n({ type: "loaded" }), e.type === "createPopup" && (W.showPopup = !0, W.cacheIndex = 0, e.content.text && (W.textToTranslate = e.content.text, W.translate()));
	}
	Nr(() => {
		if (U.settings.accentColor === jo.Custom && U.settings.customTheme) {
			let e = document.querySelector(me);
			e?.shadowRoot && Zg(e.shadowRoot, U.settings.customTheme);
		}
	}), fa(async () => {
		l.runtime.onMessage.addListener(f), is.isTranslationAPIAvailable = await e_();
	}), pa(() => {
		l.runtime.onMessage.removeListener(f);
	});
	var p = v_();
	Ii("keyup", cr, u), Ii("mouseup", cr, c);
	var m = A(p);
	va(m, () => P(n), null, (e, t) => {
		var n = Ji(), r = j(n), i = (e) => {
			Yu(e, {});
		};
		L(r, (e) => {
			P(t) && P(a) && e(i);
		}), I(e, n);
	});
	var h = M(m, 2), g = (e) => {
		Rh(e, {});
	};
	L(h, (e) => {
		W.showPopup && e(g);
	}), E(p), N(() => {
		z(p, 1, R([he, U.motionDisabled && "reduced-motion"])), mo(p, "data-contrast", U.contrast), mo(p, "data-theme", U.themeClass), mo(p, "data-theme-color", U.settings.accentColor);
	}), I(e, p), qt();
}
//#endregion
//#region src/entrypoints/content/esm-index.ts
var b_ = async (e) => {
	let t = await fetch(l.runtime.getURL("/content-scripts/esm/content.css")).then((e) => e.text());
	(await fe(e, {
		name: me,
		position: "inline",
		anchor: () => document.body || document.documentElement || document.querySelector("html") || null,
		onMount: (e, n, r) => {
			let i = new AbortController();
			[
				"keydown",
				"keyup",
				"keypress"
			].forEach((e) => {
				r.addEventListener(e, (e) => e.stopPropagation(), { signal: i.signal });
			});
			let a = Math.random().toString(36).substring(2, 15), { shadowCss: o, documentCss: s } = d(t.trim()), c = document.createElement("style");
			if (c.textContent = o, n.querySelector("head").append(c), s && !document.querySelector(`style[wxt-shadow-root-document-styles="${a}"]`)) {
				let e = document.createElement("style");
				e.textContent = s, e.setAttribute("wxt-shadow-root-document-styles", a), (document.head ?? document.body).append(e);
			}
			return {
				app: aa(y_, { target: e }),
				controller: i
			};
		},
		onRemove: (e) => {
			e && (la(e?.app), e?.controller.abort());
		}
	})).mount();
};
//#endregion
export { b_ as default };

content;