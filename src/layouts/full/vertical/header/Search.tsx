import { useState, useMemo } from "react";
import { Component, Search as SearchIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import SimpleBar from "simplebar-react";
import { getNavForRole, type ChildItem, type MenuItem } from "../../vertical/sidebar/sidebaritems";
import { useAuth } from "@/context/auth-context";

import { Input } from "@/components/ui/input";
import { Link } from "react-router";

type SearchHit = {
  name: string;
  url: string;
  path: string;
  icon?: LucideIcon;
};

function searchItems(
  items: (MenuItem | ChildItem)[],
  q: string,
  parentPath = ""
): SearchHit[] {
  let results: SearchHit[] = [];

  items.forEach((item) => {
    const currentPath = parentPath
      ? `${parentPath} → ${item.name}`
      : item.name ?? "";

    if (
      item.name &&
      item.url &&
      item.name.toLowerCase().includes(q.toLowerCase())
    ) {
      results.push({
        name: item.name,
        url: item.url,
        path: currentPath,
        icon: item.icon,
      });
    }

    if (item.items) {
      results = [...results, ...searchItems(item.items, q, currentPath)];
    }
  });

  return results;
}

function Search() {
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const menu = getNavForRole(user?.role);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchItems(menu, query);
  }, [query, menu]);

  return (
    <div className="relative w-full">
      <div className="flex items-center relative w-xs mx-auto ">
        <SearchIcon size={16}
          className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="جستجو..."
          className="rounded-lg ps-10!"
          required
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div
        className={`absolute w-full bg-card rounded-md top-11 z-10 start-0 shadow-md border border-border ${query ? "block" : "hidden"
          }`}
      >
        <SimpleBar className="h-72 p-4 custom-scroll">
          {results.length > 0 ? (
            results.map((item, i) => (
              <Link
                key={i}
                to={item.url}
                onClick={() => setQuery("")}
                className="  p-2 mb-1.5 last:mb-0 flex items-center bg-input/30 gap-2 text-sm font-medium rounded-md hover:bg-primary/5 hover:text-primary w-full overflow-hidden"
              >
                <div className="flex items-center">
                  <Component width={18} height={18} />
                  <div className="ps-3">
                    <h5 className="mb-1 text-sm group-hover/link:text-primary">
                      {item.name}
                    </h5>
                    <span className="text-xs block  truncate max-w-60">
                      {item.url}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-medium font-medium ">
                موردی یافت نشد!
              </h1>
            </div>
          )}
        </SimpleBar>
      </div>
    </div>
  );
}

export default Search;
