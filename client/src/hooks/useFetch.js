// src/hooks/useFetch.js
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";

export const useFetch = (url, options = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = async (overrideUrl, overrideOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance({
        url: overrideUrl || url,
        method: options.method || "GET",
        ...options,
        ...overrideOptions,
      });
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err?.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error, execute };
};
