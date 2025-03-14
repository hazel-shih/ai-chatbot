"use client";

import { useState, useEffect } from "react";

const useQueryParam = (param: string): string | null => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setValue(params.get(param));
  }, [param]);

  return value;
};

export default useQueryParam;
