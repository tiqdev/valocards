import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import pluginQuery from "@tanstack/eslint-plugin-query";

const DATA_FETCHING_MESSAGE =
  "Veri çekme işlemleri React Query ile yapılmalı: queries/ içindeki hook'ları kullanın.";
const SERVER_ONLY_MESSAGE =
  "lib/server yalnızca sunucu kodunda (app/**/page.tsx, layout.tsx, route.ts) kullanılabilir.";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  ...pluginQuery.configs["flat/recommended"],

  // React Query zorunluluğu: bileşenler API'ye doğrudan erişemez.
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "axios", message: DATA_FETCHING_MESSAGE },
            {
              name: "@reduxjs/toolkit",
              message: "State yönetimi için Zustand (stores/) kullanın.",
            },
            {
              name: "react-redux",
              message: "State yönetimi için Zustand (stores/) kullanın.",
            },
          ],
          patterns: [
            { group: ["@/lib/api", "@/lib/api/*"], message: DATA_FETCHING_MESSAGE },
            { group: ["@/lib/server", "@/lib/server/*"], message: SERVER_ONLY_MESSAGE },
          ],
        },
      ],
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: DATA_FETCHING_MESSAGE },
      ],
    },
  },
  {
    files: ["lib/api/**", "lib/server/**", "queries/**"],
    rules: {
      "no-restricted-imports": "off",
      "no-restricted-globals": "off",
    },
  },
  // Sunucu bileşenleri ve route handler'lar lib/server'ı kullanabilir.
  {
    files: ["app/**/page.tsx", "app/**/layout.tsx", "app/**/route.ts", "app/**/route.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [{ name: "axios", message: DATA_FETCHING_MESSAGE }],
          patterns: [
            { group: ["@/lib/api", "@/lib/api/*"], message: DATA_FETCHING_MESSAGE },
          ],
        },
      ],
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
