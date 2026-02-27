import { Search } from "lucide-react";

interface ProductHeaderProps {
  query: string;
}

export default function ProductHeader({ query }: ProductHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>

      <form className="mt-4 md:mt-0 relative">
        <input
          type="text"
          name="q"
          placeholder="Search products..."
          defaultValue={query}
          className="pl-10 pr-4 py-2.5 border border-gray-400 rounded-full w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
        />
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
      </form>
    </div>
  );
}
