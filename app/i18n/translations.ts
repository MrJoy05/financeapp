export type Locale = "en" | "es";

export const translations = {
  en: {
    brand: "Nimbus",
    tagline: "Personal finance",
    subtitle: "A clear snapshot of your money · local demo data until GraphQL sync",
    navOverview: "Overview",
    navFinance: "Categories",
    navInvestments: "Markets",
    navPatreon: "Support",
    dollarTitle: "USD → MXN",
    dollarSubtitle: "Reference rate (daily ECB series via Frankfurter)",
    dollarBase: "1 US dollar equals",
    updated: "Updated",
    syncing: "Syncing rate…",
    rateError: "Could not load rate. Showing last known value.",
    balance: "Estimated balance",
    income: "Income (month)",
    expenses: "Expenses (month)",
    savingsGoal: "Savings goal progress",
    viewDetails: "View details",
    vsLastPoll: "vs last refresh",
    langEn: "EN",
    langEs: "ES",
    themeCycle: "Theme: light, dark, or system",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    modalClose: "Close",
    authNhostTitle: "Nhost not configured",
    authNhostBody:
      "Set NEXT_PUBLIC_NHOST_SUBDOMAIN (and region) in .env to enable sign-in, database, and per-user cloud sync.",
    authClose: "Close",
    authLoginTitle: "Sign in",
    authRegisterTitle: "Create account",
    authForgotTitle: "Reset password",
    authEmail: "Email",
    authPassword: "Password",
    authPasswordCreate: "Password (min. 8 characters)",
    authShowPassword: "Show",
    authHidePassword: "Hide",
    authLoading: "Please wait…",
    authSignIn: "Sign in",
    authSignOut: "Sign out",
    authForgotLink: "Forgot password?",
    authNoAccount: "No account yet?",
    authRegisterAction: "Register",
    authHaveAccount: "Already have an account?",
    authSignInAction: "Sign in",
    authCreateAccount: "Create account",
    registerPromptTitle: "Create a free account",
    registerPromptBody:
      "To keep using Nimbus with encrypted sign-in and cloud backup for your workbook, register — it does not cost anything.",
    registerPromptCta: "Register free",
    registerPromptLater: "Not now",
    registerPromptLogin: "I already have an account",
    registerPromptNote:
      "You can keep exploring locally; syncing across devices unlocks after you sign up.",
    authVerifyEmail: "Check your inbox to verify your email address.",
    authRedirectHint:
      "In Nhost → Authentication → URL allow list, add your app URL (e.g. http://localhost:3000 and your production domain).",
    authForgotLead:
      "We will email you a secure link. After opening it, set a new password on the next screen.",
    authResetSent: "If that email exists, we sent a reset link.",
    authSendLink: "Send link",
    authBackToLogin: "Back to sign in",
    authDisabled: "Auth",
    financeSectionsTitle: "Your categories & plans",
    financeSectionsLead:
      "Fixed bills, subscriptions, housing, insurance, variable spend, cards, investments, and named goals — organized in one place. Data stays in this browser unless you sync with your account.",
    financeDisclaimerFooter:
      "Nimbus is educational tooling — not regulated financial, tax, or legal advice.",
    financePlansTitle: "Plans that pair with your goals",
    financePlansLead:
      "Rough templates — tune percentages to your income, obligations, and risk tolerance.",
    financePlanStarterTitle: "Starter — stability first",
    financePlanStarterBody:
      "• Build at least one month of expenses in cash.\n• After fixed costs, target ~5–10% of income to named goals.\n• Pay cards above the minimum whenever you can.",
    financePlanBalancedTitle: "Balanced — cushion + growth",
    financePlanBalancedBody:
      "• Aim for ~3–6 months of expense coverage.\n• Split discretionary surplus across goals + diversified indexes.\n• Review subscriptions and insurance once a year.",
    financePlanGrowthTitle: "Growth — long-term tilt",
    financePlanGrowthBody:
      "• Fit only once buffers are funded and income is dependable.\n• Keep broad diversification; skip single-stock concentration.\n• Rebalance on a calendar, not on headlines.",
    guidesHubTitle: "Guides & starting points",
    guidesHubLead:
      "Explainers plus practical checklists — always confirm specifics with banks, insurers, and licensed advisors.",
    guideCompoundTitle: "How compound growth works",
    guideCompoundBody:
      "Returns apply on both principal and prior gains — small early deposits can outperform larger late deposits. Debt compounds against you too (especially high APR revolving cards).\n\nRule of ~72 (intuition): 72 ÷ expected annual rate ≈ years to double. Not a prediction — ignores fees, volatility, inflation, taxes.\n\nHigher compounding frequency matters a little; long holding periods matter a lot.",
    guidePortfoliosTitle: "Investment menu ideas (education only)",
    guidePortfoliosBody:
      "• Global stock/bond index funds as core.\n• Target-date envelopes for milestone years.\n• Short-duration cash instruments for liquidity.\n• Optional satellite sleeves (listed real assets) — modest sizing.\n\nPast performance ≠ future results. Taxes and brokerage rules differ — personalize with a fiduciary where needed.",
    guideBanksTitle: "Bank-account checklist",
    guideBanksBody:
      "Prioritize safeguards (deposit insurance limits), clarity on fees/FX, uptime of the mobile app, and ATM reach. MX: compare CETES/sofinapped rates vs commissions. Abroad: HY savings versus broker sweep yields — always read disclosures.",
    guideCardsTitle: "Credit-card hygiene",
    guideCardsBody:
      "Capture minimums and due cycles here.\nPrefer paying statement balances monthly to dodge interest.\nWeigh yearly fees versus rewards you realistically earn; inspect foreign transaction fees.\nReduce unused cards — smaller attack surface for fraud.",
    guideRentInsuranceTitle: "Rent, insurance, repeating bills",
    guideRentInsuranceBody:
      "Splitting housing and premiums makes rent hikes vs renewal premiums obvious.\nFor insurance, log deductibles/exclusions beside the premium equivalents you track.\nNegotiate telecom contracts and rerun auto quotes annually.",
    sectionFixedTitle: "Fixed expenses",
    sectionFixedDesc: "Utilities and recurring dues outside housing premiums.",
    sectionSubsTitle: "Subscriptions",
    sectionSubsDesc: "Streaming, software, memberships.",
    sectionVariableTitle: "Variable expenses",
    sectionVariableDesc: "Groceries, transport, discretionary spending.",
    sectionInvestTitle: "Investments & reserves",
    sectionInvestDesc: "Funds, ETFs, liquidity buckets — labels only.",
    sectionSavingsTitle: "Savings plan",
    sectionSavingsDesc: "Set a goal and track how close you are today.",
    savingsGoalAmount: "Goal amount (MXN)",
    savingsCurrentAmount: "Saved to date (MXN)",
    savingsApply: "Update progress",
    ledgerNamePh: "Description",
    ledgerAmountPh: "Amount",
    ledgerAdd: "Add row",
    ledgerRemoveAria: "Remove row",
    patreonKicker: "Support the project",
    patreonTitle: "Patreon",
    patreonBody:
      "If Nimbus saves you time, consider supporting continued development via Patreon — early features, changelog, and more.",
    patreonCta: "Open Patreon",
    patreonNoUrl:
      'Add NEXT_PUBLIC_PATREON_URL in .env to show your supporter link (e.g. https://www.patreon.com/yourname).',
    setPwTitle: "Set new password",
    setPwLead:
      "Open this page from the reset link in your email. If you landed here manually, request a reset from sign-in.",
    setPwHome: "← Back home",
    setPwLabel: "New password",
    setPwSubmit: "Save password",
    setPwSuccess: "Password updated. You can return to the app.",
    subtitleDemo:
      "Interactive preview with fictitious MXN data stored only in this browser.",
    subtitleGuest: "Sign in to load your secure workspace (empty until you add figures).",
    subtitleUser:
      "Your ledger is private on this device · sync to Postgres/Hasura when you are ready.",
    navAccount: "Account",
    demoRibbon:
      "Demo mode: sample numbers for exploration. After sign-in your board starts clean.",
    financeSectionsLeadDemo:
      "Example categories illustrate the product. Nothing is sent to our servers until you use Nhost + GraphQL.",
    financeSectionsLeadUser:
      "Your authenticated ledger on this device — add real lines and goals. Back it with Nhost for multi-device sync.",
    healthTitle: "Financial health",
    healthScore: "Score",
    healthUnknown: "Needs input",
    healthExcellent: "Excellent",
    healthGood: "Solid",
    healthFair: "Watch",
    healthRisk: "Stressed",
    healthExpenseRatio: "Expenses vs income",
    healthSavingsRate: "Discretionary margin",
    healthMonthsCovered: "Liquidity (months of spend)",
    monthlyIncomeTitle: "Monthly income (estimate)",
    monthlyIncomeDesc: "Used for ratios in the health panel and KPIs.",
    monthlyIncomeSave: "Save income",
    goalsExtendedTitle: "Savings goals",
    goalsExtendedLead:
      "House, travel, emergency buffer — quantify each goal above, then match it to one of the plan templates.",
    sectionHousingTitle: "Housing",
    sectionHousingDesc:
      "Rent or mortgage (principal & interest estimate) each month.",
    sectionInsuranceTitle: "Insurance premiums",
    sectionInsuranceDesc:
      "Auto, medical, renters, term life — approximate monthly cost.",
    sectionCreditTitle: "Credit cards",
    sectionCreditDesc:
      "Minimums, installments, recurring charges — use notes for APR or payoff targets.",
    goalTarget: "Target (MXN)",
    goalCurrent: "Saved (MXN)",
    goalAddPlaceholder: "e.g. Apartment down payment",
    goalAdd: "Add goal",
    agentTitle: "Finance co-pilot",
    agentLead:
      "Rule-based tips from your numbers (not licensed advice). Ask in your own words.",
    agentPlaceholder:
      "Try: “How do I save for a house?” or “Suscripciones altas”…",
    agentAnalyze: "Suggest next steps",
    investmentsTitle: "Markets pulse",
    investmentsLead:
      "Reference prices via Yahoo Chart API (delayed). México (.MX suffix) y EUA.",
    investmentsDisclosure:
      "Education only · not trading advice · verify with your custodian.",
    investmentsRefresh: "Refresh quotes",
    investmentsUs: "United States",
    investmentsMx: "Mexico (BMV listings)",
    investmentsError: "Could not refresh some symbols.",
    accountModalTitle: "Account & security",
    accountModalGuestLead:
      "Sign in to see your email, identifiers, and how we handle data.",
    accountModalEmail: "Email",
    accountModalUserId: "Masked user ID",
    accountModalSecurityTitle: "Production posture",
    accountModalSecurityTls:
      "Nhost transmits auth over HTTPS; refresh tokens rotate with short-lived JWTs.",
    accountModalSecurityJwt:
      "GraphQL/Harura row-level policies should scope rows to your user id—configure before launch.",
    accountModalSecurityLocal:
      "Ledger JSON today lives in your browser (localStorage) until you wire cloud tables.",
    accountModalSecurityProd:
      "Enable MFA in Nhost, restrict redirect URLs, and monitor auth logs in production.",
  },
  es: {
    brand: "Nimbus",
    tagline: "Finanzas personales",
    subtitle:
      "Un vistazo claro de tu dinero · datos demo locales hasta sincronizar con GraphQL",
    navOverview: "Resumen",
    navFinance: "Categorías",
    navInvestments: "Mercados",
    navPatreon: "Apoyo",
    dollarTitle: "USD → MXN",
    dollarSubtitle:
      "Tipo de cambio referencia (serie diaria ECB vía Frankfurter)",
    dollarBase: "1 dólar estadounidense equivale a",
    updated: "Actualizado",
    syncing: "Sincronizando tipo…",
    rateError: "No se pudo cargar el tipo. Mostrando último valor.",
    balance: "Saldo estimado",
    income: "Ingresos (mes)",
    expenses: "Gastos (mes)",
    savingsGoal: "Avance meta de ahorro",
    viewDetails: "Ver detalles",
    vsLastPoll: "vs última actualización",
    langEn: "EN",
    langEs: "ES",
    themeCycle: "Tema: claro, oscuro o automático",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeSystem: "Sistema",
    modalClose: "Cerrar",
    authNhostTitle: "Nhost no configurado",
    authNhostBody:
      "Define NEXT_PUBLIC_NHOST_SUBDOMAIN (y la región) en .env para iniciar sesión, base de datos y sincronización por usuario.",
    authClose: "Cerrar",
    authLoginTitle: "Entrar",
    authRegisterTitle: "Crear cuenta",
    authForgotTitle: "Restablecer contraseña",
    authEmail: "Correo",
    authPassword: "Contraseña",
    authPasswordCreate: "Contraseña (mín. 8 caracteres)",
    authShowPassword: "Mostrar",
    authHidePassword: "Ocultar",
    authLoading: "Un momento…",
    authSignIn: "Entrar",
    authSignOut: "Salir",
    authForgotLink: "¿Olvidaste la contraseña?",
    authNoAccount: "¿Sin cuenta?",
    authRegisterAction: "Registro",
    authHaveAccount: "¿Ya tienes cuenta?",
    authSignInAction: "Entrar",
    authCreateAccount: "Crear cuenta",
    registerPromptTitle: "Regístrate gratis",
    registerPromptBody:
      "Para seguir usando Nimbus con inicio de sesión seguro y respaldo en la nube de tu libro, crea una cuenta — no tiene costo.",
    registerPromptCta: "Registrarme gratis",
    registerPromptLater: "Ahora no",
    registerPromptLogin: "Ya tengo cuenta",
    registerPromptNote:
      "Puedes seguir explorando en este equipo; la sincronización entre dispositivos se activa al registrarte.",
    authVerifyEmail: "Revisa tu bandeja para verificar el correo.",
    authRedirectHint:
      "En Nhost → Authentication → URL allow list, añade la URL de esta app (ej. http://localhost:3000 y tu dominio en producción).",
    authForgotLead:
      "Te enviaremos un enlace seguro. Al abrirlo, podrás definir una contraseña nueva en la siguiente pantalla.",
    authResetSent:
      "Si el correo existe, enviamos un enlace para restablecer.",
    authSendLink: "Enviar enlace",
    authBackToLogin: "Volver al inicio de sesión",
    authDisabled: "Cuenta",
    financeSectionsTitle: "Tus categorías y planes",
    financeSectionsLead:
      "Servicios fijos, suscripciones, vivienda, seguros, gasto variable, tarjetas, inversiones y metas con nombre — todo en un solo tablero. Los datos quedan en este navegador salvo que sincronicemos con tu cuenta.",
    financeDisclaimerFooter:
      "Nimbus es material educativo — no constituye asesoría financiera, fiscal o legal regulada.",
    financePlansTitle: "Planes que acompañan tus metas",
    financePlansLead:
      "Plantillas orientativas — ajusta porcentajes a tu ingreso, obligaciones y tolerancia al riesgo.",
    financePlanStarterTitle: "Inicio — estabilidad primero",
    financePlanStarterBody:
      "• Apunta a al menos un mes de gastos en efectivo digital.\n• Después de lo fijo, dirige ~5–10% del ingreso a metas concretas.\n• Paga tarjetas por encima del mínimo siempre que puedas.",
    financePlanBalancedTitle: "Equilibrado — colchón + crecimiento",
    financePlanBalancedBody:
      "• Busca ~3–6 meses de gastos cubiertos.\n• Reparte el superávit entre metas e índices diversificados.\n• Revisa suscripciones y seguros al menos una vez al año.",
    financePlanGrowthTitle: "Crecimiento — foco largo plazo",
    financePlanGrowthBody:
      "• Solo si ya tienes colchón e ingresos estables.\n• Mantén diversificación global; evita concentrarte en una sola emisora.\n• Rebalancea con calendario, no con titulares.",
    guidesHubTitle: "Guías y puntos de partida",
    guidesHubLead:
      "Resúmenes y listas — confirma montos, comisiones y coberturas con tu banco, aseguradora o asesor licenciado.",
    guideCompoundTitle: "Cómo funciona el interés compuesto",
    guideCompoundBody:
      "Las ganancias se aplican sobre capital y sobre lo ya acumulado: aportaciones pequeñas al inicio pueden superar aportaciones grandes después. Las deudas también se capitalizan en tu contra (sobre todo tarjetas con TAC altísima).\n\nRegla práctica (~72): 72 ÷ tasa anual esperada ≈ años para duplicar (intuición, no promesa — ignora comisiones, volatilidad, inflación e impuestos).\n\nLa frecuencia de capitalización ayuda un poco; el horizonte largo ayuda mucho.",
    guidePortfoliosTitle: "Alternativas de portafolio (solo educación)",
    guidePortfoliosBody:
      "• Fondos/ETFs de renta variable y deuda globales como núcleo.\n• Carteras con fecha objetivo para metas futuras.\n• Instrumentos cortos para liquidez inmediata.\n• Satélites modestos (REITs listados, etc.).\n\nRendimientos pasados no garantizan futuros. Reglas fiscales y de casas de bolsa cambian — personaliza con ayuda profesional si aplica.",
    guideBanksTitle: "Elegir cuentas bancarias",
    guideBanksBody:
      "Prioriza seguros de depósito vigentes, comisiones claras, app confiable y red de cajeros. En México compara tasas en instituciones reguladas (bancos, SOFIPOs) y lee letras chicas. En el extranjero contrasta cuentas remuneradas vs. sweeps de broker — revisa prospectos.",
    guideCardsTitle: "Gestionar tarjetas de crédito",
    guideCardsBody:
      "Marca aquí mínimos, fechas de corte/pago y anualidades prorrateadas.\nCuando puedas liquida saldo estado de cuenta mensualmente para cortar revolvencia.\nCompara perks vs comisiones saladas; vigila cargos extranjeros (FX).\nElimina tarjetas poco usadas para reducir fraude superficie.",
    guideRentInsuranceTitle: "Renta, seguros y recibos repetidos",
    guideRentInsuranceBody:
      "Separar renta/hipoteca y primas hace evidentes alzas o renovaciones caras.\nAnota deducibles y exclusiones junto al costo mensual equivalente.\nRenegocia telecom y vuelve a cotizar auto/casa al renovar.",
    sectionFixedTitle: "Gastos fijos",
    sectionFixedDesc: "Servicios y cuotas recurrentes fuera de vivienda y seguros.",
    sectionSubsTitle: "Suscripciones",
    sectionSubsDesc: "Streaming, software, membresías.",
    sectionVariableTitle: "Gastos variables",
    sectionVariableDesc: "Super, transporte, gasto discrecional.",
    sectionInvestTitle: "Inversiones y reserva",
    sectionInvestDesc: "Fondos, ETFs, efectivo estratégico — solo etiquetas.",
    sectionSavingsTitle: "Plan de ahorro",
    sectionSavingsDesc: "Define una meta y ve qué tanto llevas acumulado.",
    savingsGoalAmount: "Meta (MXN)",
    savingsCurrentAmount: "Ahorrado a la fecha (MXN)",
    savingsApply: "Actualizar avance",
    ledgerNamePh: "Concepto",
    ledgerAmountPh: "Importe",
    ledgerAdd: "Añadir",
    ledgerRemoveAria: "Quitar fila",
    patreonKicker: "Apoya el proyecto",
    patreonTitle: "Patreon",
    patreonBody:
      "Si Nimbus te sirve y quieres impulsar mejoras continuas, puedes hacerlo desde Patreon: novedades, roadmap y beneficios exclusivos.",
    patreonCta: "Ir a Patreon",
    patreonNoUrl:
      'Añade NEXT_PUBLIC_PATREON_URL en .env para mostrar tu enlace de apoyo (ej. https://www.patreon.com/tusuario).',
    setPwTitle: "Nueva contraseña",
    setPwLead:
      "Entra desde el enlace del correo que te enviamos. Si llegaste aquí sin el enlace, pide uno desde iniciar sesión.",
    setPwHome: "← Volver al inicio",
    setPwLabel: "Contraseña nueva",
    setPwSubmit: "Guardar contraseña",
    setPwSuccess: "Contraseña actualizada. Puedes volver a la app.",
    subtitleDemo:
      "Vista previa interactiva con datos ficticios en MXN solo en este navegador.",
    subtitleGuest:
      "Inicia sesión para tu espacio seguro (vacío hasta que cargues cifras reales).",
    subtitleUser:
      "Tu libro en este dispositivo es privado · sincroniza con Postgres/Hasura cuando quieras.",
    navAccount: "Cuenta",
    demoRibbon:
      "Modo demo: cifras de ejemplo. Tras iniciar sesión el tablero arranca limpio.",
    financeSectionsLeadDemo:
      "Las categorías ilustran el producto. No enviamos nada al servidor hasta que uses Nhost + GraphQL.",
    financeSectionsLeadUser:
      "Tu libro autenticado en este equipo — añade datos reales y metas. Respáldalo con Nhost para multi-dispositivo.",
    healthTitle: "Salud financiera",
    healthScore: "Puntuación",
    healthUnknown: "Requiere datos",
    healthExcellent: "Excelente",
    healthGood: "Sólida",
    healthFair: "Atención",
    healthRisk: "Tensión",
    healthExpenseRatio: "Gastos vs ingreso",
    healthSavingsRate: "Margen disponible",
    healthMonthsCovered: "Liquidez (meses de gasto)",
    monthlyIncomeTitle: "Ingreso mensual (estimado)",
    monthlyIncomeDesc: "Sirve para ratios de salud y KPIs.",
    monthlyIncomeSave: "Guardar ingreso",
    goalsExtendedTitle: "Metas de ahorro",
    goalsExtendedLead:
      "Casa, viaje, colchón — pon cifras arriba y alinéalas con una plantilla de plan.",
    sectionHousingTitle: "Vivienda",
    sectionHousingDesc:
      "Renta o hipoteca (capital + interés estimado) mensual.",
    sectionInsuranceTitle: "Primas de seguros",
    sectionInsuranceDesc:
      "Auto, gastos médicos, hogar, vida temporal — costo mensual equivalente.",
    sectionCreditTitle: "Tarjetas de crédito",
    sectionCreditDesc:
      "Mínimos, MSI recurrente, anualidad prorrateada — usa notas para TAC u objetivos de pago.",
    goalTarget: "Meta (MXN)",
    goalCurrent: "Ahorrado (MXN)",
    goalAddPlaceholder: "Ej. enganche departamento",
    goalAdd: "Añadir meta",
    agentTitle: "Copiloto financiero",
    agentLead:
      "Consejos basados en reglas y tus números (no es asesoría regulada).",
    agentPlaceholder:
      'Prueba: "¿Cómo ahorro para casa?" o "Muchas suscripciones"…',
    agentAnalyze: "Sugerir pasos",
    investmentsTitle: "Pulso de mercados",
    investmentsLead:
      "Precios referencia vía Yahoo Chart API (retrasados). México (.MX) y EUA.",
    investmentsDisclosure:
      "Solo educación · no es recomendación de compra/venta · verifica con tu casa de bolsa.",
    investmentsRefresh: "Actualizar cotizaciones",
    investmentsUs: "Estados Unidos",
    investmentsMx: "México (listados BMV)",
    investmentsError: "No se pudieron actualizar algunos símbolos.",
    accountModalTitle: "Cuenta y seguridad",
    accountModalGuestLead:
      "Inicia sesión para ver tu correo, identificadores y cómo protegemos datos.",
    accountModalEmail: "Correo",
    accountModalUserId: "ID de usuario enmascarado",
    accountModalSecurityTitle: "Listo para producción",
    accountModalSecurityTls:
      "Nhost usa HTTPS; los tokens de acceso son JWT de corta vida con rotación.",
    accountModalSecurityJwt:
      "En Hasura define políticas por user_id para que cada fila sea solo del dueño.",
    accountModalSecurityLocal:
      "Hoy el libro vive en localStorage del navegador hasta que conectes tablas en la nube.",
    accountModalSecurityProd:
      "Activa MFA en Nhost, restringe redirect URLs y monitorea logs de auth en producción.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
