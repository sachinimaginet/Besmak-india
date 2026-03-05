import { query as dbQuery } from "@/lib/db";
import ProductHeader from "@/components/sections/products/ProductHeader";
import ProductGrid from "@/components/sections/products/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import ProductFilters from "@/components/sections/products/ProductFilters";
import Link from "next/link";
import { X } from "lucide-react";
import { Metadata } from "next";
import { getPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("products");
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    page?: string;
    series?: string;
    way?: string;
    material?: string;
    mf?: string;
    colour?: string;
    sealed?: string;
    categoryNumber?: string;
    categoryId?: string;
  };
}) {
  const searchTerm = searchParams.q || "";
  const keywords = searchTerm
    .trim()
    .split(/\s+/)
    .filter((k) => k.length > 0);
  const currentPage = parseInt(searchParams.page || "1") || 1;
  const itemsPerPage = 20;
  const offset = (currentPage - 1) * itemsPerPage;

  // --- FILTER OPTIONS DATA FETCHING ---
  // We'll fetch unique values to populate the sidebar selects
  const [allProducts, allCategories] = await Promise.all([
    dbQuery<any[]>("SELECT specifications, categorySpecification FROM product"),
    dbQuery<any[]>("SELECT id, name FROM category"),
  ]);

  const filterData = {
    series: new Set<string>(),
    way: new Set<string>(),
    material: new Set<string>(),
    mf: new Set<string>(),
    colour: new Set<string>(),
    sealed: new Set<string>(),
    categorySpecification: new Set<string>(),
  };

  allProducts.forEach((p) => {
    if (p.categorySpecification)
      filterData.categorySpecification.add(String(p.categorySpecification));
    if (p.specifications) {
      try {
        const specs =
          typeof p.specifications === "string"
            ? JSON.parse(p.specifications)
            : p.specifications;
        if (specs.Series) filterData.series.add(String(specs.Series));
        if (specs.Way) filterData.way.add(String(specs.Way));
        // Split comma-separated values for cleaner filters
        if (specs.Material) {
          String(specs.Material)
            .split(",")
            .forEach((m) => filterData.material.add(m.trim()));
        }
        if (specs["M / F"]) filterData.mf.add(String(specs["M / F"]).trim());
        if (specs.Colour) {
          String(specs.Colour)
            .split(",")
            .forEach((c) => filterData.colour.add(c.trim()));
        }
        if (specs["Sealed / Unsealed"])
          filterData.sealed.add(String(specs["Sealed / Unsealed"]).trim());
      } catch (e) { }
    }
  });

  const filterGroups = [
    {
      id: "categoryId",
      label: "Category",
      options: allCategories.map((c) => ({ label: c.name, value: c.id })),
    },
    {
      id: "categoryNumber",
      label: "Number",
      options: Array.from(filterData.categorySpecification)
        .sort()
        .map((v) => ({ label: v, value: v })),
    },
    {
      id: "series",
      label: "Series",
      options: Array.from(filterData.series)
        .sort()
        .map((v) => ({ label: v, value: v })),
    },
    {
      id: "way",
      label: "Way",
      options: Array.from(filterData.way)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((v) => ({ label: v, value: v })),
    },
    {
      id: "material",
      label: "Material",
      options: Array.from(filterData.material)
        .sort()
        .map((v) => ({ label: v, value: v })),
    },
    {
      id: "colour",
      label: "Colour",
      options: Array.from(filterData.colour)
        .sort()
        .map((v) => ({ label: v, value: v })),
    },
    {
      id: "mf",
      label: "M/F",
      options: Array.from(filterData.mf)
        .sort()
        .map((v) => ({ label: v, value: v })),
    },
    {
      id: "sealed",
      label: "Sealed",
      options: Array.from(filterData.sealed)
        .sort()
        .map((v) => ({ label: v, value: v })),
    },
  ];

  // --- BUILD ACTIVE FILTER CHIPS ---
  const activeChips: { id: string; label: string; valueLabel: string }[] = [];
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key !== "q" && key !== "page" && value) {
      const group = filterGroups.find((g) => g.id === key);
      if (group) {
        let valueLabel = value;
        if (key === "categoryId") {
          valueLabel = allCategories.find((c) => c.id === value)?.name || value;
        }
        activeChips.push({ id: key, label: group.label, valueLabel });
      }
    }
  });

  const getClearFilterLink = (idToRemove: string) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== idToRemove && value) {
        params.set(key, value);
      }
    });
    params.delete("page");
    return `/products?${params.toString()}`;
  };

  const clearAllLink = () => {
    const params = new URLSearchParams();
    if (searchParams.q) params.set("q", searchParams.q);
    return `/products?${params.toString()}`;
  };

  // --- DYNAMIC FILTERING LOGIC ---
  let whereClause = "1=1";
  let queryParams: any[] = [];

  // Search Query
  if (keywords.length > 0) {
    const nameConditions = keywords.map(() => "p.name LIKE ?").join(" AND ");
    const categoryConditions = keywords
      .map(() => "c.name LIKE ?")
      .join(" AND ");
    whereClause = `(${nameConditions}) OR (c.name IS NOT NULL AND ${categoryConditions})`;
    queryParams = [
      ...keywords.map((k) => `%${k}%`),
      ...keywords.map((k) => `%${k}%`),
    ];
  }

  // Technical Filters
  const addFilter = (
    field: string,
    param: string | undefined,
    isJson: boolean = true,
  ) => {
    if (param) {
      if (isJson) {
        // Use JSON_EXTRACT for specifications fields
        whereClause += ` AND JSON_EXTRACT(p.specifications, '$.\"${field}\"') LIKE ?`;
        queryParams.push(`%${param}%`);
      } else {
        whereClause += ` AND p.${field} = ?`;
        queryParams.push(param);
      }
    }
  };

  addFilter("categoryId", searchParams.categoryId, false);
  addFilter("categorySpecification", searchParams.categoryNumber, false);
  addFilter("Series", searchParams.series);
  addFilter("Way", searchParams.way);
  addFilter("Material", searchParams.material);
  addFilter("M / F", searchParams.mf);
  addFilter("Colour", searchParams.colour);
  addFilter("Sealed / Unsealed", searchParams.sealed);

  // 1. Get total count
  const countSql = `
    SELECT COUNT(*) as total 
    FROM product p 
    LEFT JOIN category c ON p.categoryId = c.id 
    WHERE ${whereClause}
  `;
  const countResult = await dbQuery<any[]>(countSql, queryParams);
  const totalProducts = countResult[0]?.total || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // 2. Get paginated products
  const productsSql = `
    SELECT p.*, c.name as categoryName 
    FROM product p 
    LEFT JOIN category c ON p.categoryId = c.id 
    WHERE ${whereClause}
    ORDER BY p.createdAt DESC
    LIMIT ? OFFSET ?
  `;
  const products = await dbQuery<any[]>(productsSql, [
    ...queryParams,
    itemsPerPage,
    offset,
  ]);

  const filteredProducts = products.map((p: any) => ({
    ...p,
    category: {
      name: p.categoryName,
    },
  }));

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <ProductHeader query={searchTerm} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <ProductFilters filterGroups={filterGroups} />

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Active Filters Display */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-gray-500 text-sm">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {totalProducts}
                  </span>{" "}
                  products
                </p>

                {activeChips.length > 0 && (
                  <Link
                    href={clearAllLink()}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors  tracking-wider"
                  >
                    Clear All Filters
                  </Link>
                )}
              </div>

              {activeChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeChips.map((chip) => (
                    <Link
                      key={chip.id}
                      href={getClearFilterLink(chip.id)}
                      className="group flex items-center gap-1.5 bg-white border border-blue-100 pl-3 pr-2 py-1.5 rounded-full text-[10px] font-bold text-gray-700 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                    >
                      <span className="text-blue-600  tracking-tighter opacity-70">
                        {chip.label}:
                      </span>
                      <span className="text-gray-900">{chip.valueLabel}</span>
                      <div className="bg-gray-100 group-hover:bg-red-500 group-hover:text-white p-0.5 rounded-full transition-colors">
                        <X className="h-2.5 w-2.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <ProductGrid products={filteredProducts} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/products"
              queryParams={searchParams}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
