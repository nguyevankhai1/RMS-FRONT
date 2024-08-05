interface HistoryItem {
  name?: string;
  path: string;
  params?: { [key: string]: any };
  query?: { [key: string]: any };
  //search contains data like paging information received from compnents
  search?: { [key: string]: any };
}

const defaultPaging = {
  currentPage: 0,
  numPerPage: 20,
};

const fallbackHistory = {
  name: "application___vi",
  params: {},
  path: "/application",
  query: {},
  search: defaultPaging,
};

const concatQueries = (history: HistoryItem) => {
  let queries = "?";
  for (const [key, value] of Object.entries(history.query || {})) {
    queries += `${key}=${value}&`;
  }
  return queries.substring(0, queries.length - 1);
};

export default function useHistory() {
  const history = useState<HistoryItem[]>("history", () => []);

  const setHistory = (newHistory: HistoryItem) => {
    const exists = history.value.find(({ path }) => path === newHistory.path);

    const lastItem = history.value[history.value.length - 1];
    if (lastItem) {
      if (lastItem.search) {
        lastItem.search = { ...lastItem.search, ...defaultPaging };
      } else {
        Object.defineProperty(lastItem, "search", defaultPaging);
      }
    }

    //add new one if not found
    if (!exists) history.value.push(newHistory);
    //otherwise, overwirte with new data if already exists
    else
      history.value = [...history.value.filter(({ path }) => path !== newHistory.path), newHistory];
  };

  const { locale } = useI18n();

  const goBack = async () => {
    let lastHistoryItem = history.value[history.value.length - 1];

    if (!lastHistoryItem) {
      const currentPath = "/" + useRouter().currentRoute.value.path.split("/")[1];
      lastHistoryItem = { path: currentPath };
      history.value.push(lastHistoryItem);
    }

    /* if current url is the  same as last item in history stack,
    set lastHistoryItem to navigate to application page
    */
    if (lastHistoryItem && useRouter().currentRoute.value.path === lastHistoryItem.path) {
      lastHistoryItem = fallbackHistory;
      history.value.push(fallbackHistory);
    }

    history.value.push(lastHistoryItem);

    const language = locale.value === "vi" ? "" : `/${locale.value}`;

    let path = lastHistoryItem.path;

    if (path.search(/\/en\//) !== -1) {
      path = path.replace("/en", "");
    }

    if (locale.value === "en") {
      path = language + path;
    }

    await navigateTo(`${path}${concatQueries(lastHistoryItem)}`);
  };

  return {
    history,
    setHistory,
    goBack,
  };
}
