import { Search } from "lucide-react";

interface ProductHeaderProps {
  query: string;
}

export default function ProductHeader({ query }: ProductHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Product Catalog</h1>

      <form className="mt-4 md:mt-0 relative">
        <input
          type="text"
          name="q"
          placeholder="Search products..."
          defaultValue={query}
          className="pl-10 pr-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </form>
    </div>
  );
}
