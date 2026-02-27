import type { Route } from "./+types/home";
import { useLoaderData, useSearchParams } from "react-router";
import { useState } from "react";
import { 
  LogoIcon, 
  MenuIcon, 
  CloseIcon, 
  MapIcon, 
  BuildingIcon, 
  LocationMarkerIcon, 
  ChevronDownIcon, 
  ResetIcon, 
  ArrowDownIcon 
} from "../components/icons";
import type { RegionData } from "../types";

// fetch data
export async function clientLoader() {
  const response = await fetch("/data/indonesia_regions.json");
  if (!response.ok) {
    throw new Error("Failed to load region data");
  }
  const data = await response.json();
  return data as RegionData;
}

export function HydrateFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-lg font-semibold text-gray-500">Loading region data...</div>
    </div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Frontend Assessment" },
    { name: "description", content: "Region Filter Application" },
  ];
}

export default function Home() {
  const { provinces, regencies, districts } = useLoaderData() as RegionData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedProvinceId = searchParams.get("province");
  const selectedRegencyId = searchParams.get("regency");
  const selectedDistrictId = searchParams.get("district");

  // Filter Data
  const filteredRegencies = selectedProvinceId
    ? regencies.filter((r) => r.province_id === Number(selectedProvinceId))
    : [];

  const filteredDistricts = selectedRegencyId
    ? districts.filter((d) => d.regency_id === Number(selectedRegencyId))
    : [];

  const selectedProvince = provinces.find(
    (p) => p.id === Number(selectedProvinceId)
  );
  const selectedRegency = regencies.find(
    (r) => r.id === Number(selectedRegencyId)
  );
  const selectedDistrict = districts.find(
    (d) => d.id === Number(selectedDistrictId)
  );
 
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ province: value });
    } else {
      setSearchParams({});
    }
  };

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({
        province: selectedProvinceId || "",
        regency: value,
      });
    } else {
      setSearchParams({ province: selectedProvinceId || "" });
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({
        province: selectedProvinceId || "",
        regency: selectedRegencyId || "",
        district: value,
      });
    } else {
      setSearchParams({
        province: selectedProvinceId || "",
        regency: selectedRegencyId || "",
      });
    }
  };

  const handleReset = () => {
    setSearchParams({});
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-white font-sans text-gray-900">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-20 w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[16px] bg-blue-100 text-blue-600">
            <LogoIcon width="16" height="16" />
          </div>
          <h1 className="text-sm font-bold text-gray-900">Frontend Assessment</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          <MenuIcon width="24" height="24" />
        </button>
      </header>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-80 border-r border-gray-200 bg-white p-6 flex flex-col fixed inset-y-0 left-0 overflow-y-auto z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-blue-100 text-blue-600">
            <LogoIcon width="24" height="24" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">Frontend Assessment</h1>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-900"
          >
            <CloseIcon width="24" height="24" />
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6">
              Filter Wilayah
            </h2>

            {/* Provinsi */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-bold text-gray-400 uppercase">
                Provinsi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <MapIcon className="h-5 w-5" />
                </div>
                <select
                  name="province"
                  value={selectedProvinceId || ""}
                  onChange={handleProvinceChange}
                  className="w-full appearance-none rounded-[16px] border border-gray-300 bg-white pl-12 pr-10 py-3 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-gray-50"
                >
                  <option value="" disabled>
                    Select Province
                  </option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Kota/Kabupaten */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-bold text-gray-400 uppercase">
                Kota/Kabupaten
              </label>
              <div className="relative">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <BuildingIcon className="h-5 w-5" />
                </div>
                 <select
                  name="regency"
                  value={selectedRegencyId || ""}
                  onChange={handleRegencyChange}
                  disabled={!selectedProvinceId}
                  className="w-full appearance-none rounded-[16px] border border-gray-300 bg-white pl-12 pr-10 py-3 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer hover:enabled:bg-gray-50"
                >
                  <option value="" disabled>
                    Select City/Regency
                  </option>
                  {filteredRegencies.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Kecamatan */}
            <div className="mb-10">
              <label className="mb-2 block text-xs font-bold text-gray-400 uppercase">
                Kecamatan
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <LocationMarkerIcon className="h-5 w-5" />
                </div>
                <select
                  name="district"
                  value={selectedDistrictId || ""}
                  onChange={handleDistrictChange}
                  disabled={!selectedRegencyId}
                  className="w-full appearance-none rounded-[16px] border border-gray-300 bg-white pl-12 pr-10 py-3 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer hover:enabled:bg-gray-50"
                >
                  <option value="" disabled>
                    Select District
                  </option>
                  {filteredDistricts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex w-full items-center justify-center gap-2 rounded-[16px] border border-blue-600 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors uppercase tracking-wide"
            >
              <ResetIcon width="16" height="16" />
              RESET
            </button>
          </div>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 lg:ml-80 bg-white transition-all duration-300">
        {/* Breadcrumb */}
        <nav className="breadcrumb sticky top-[65px] lg:top-0 z-10 bg-white/95 backdrop-blur-sm text-sm p-4 lg:p-8 items-center font-medium text-gray-400 flex flex-wrap items-center border-b border-gray-200 pb-4 overflow-x-auto">
            <span className={!selectedProvince ? "text-blue-500 font-bold" : "hover:text-blue-500 transition-colors"}>Indonesia</span>
            {selectedProvince && (
                <>
                    <span className="mx-3 text-gray-300">›</span>
                    <span className={!selectedRegency ? "text-blue-500 font-bold" : "hover:text-blue-500 transition-colors"}>{selectedProvince.name}</span>
                </>
            )}
            {selectedRegency && (
                <>
                    <span className="mx-3 text-gray-300">›</span>
                    <span className={!selectedDistrict ? "text-blue-500 font-bold" : "hover:text-blue-500 transition-colors"}>{selectedRegency.name}</span>
                </>
            )}
            {selectedDistrict && (
                <>
                    <span className="mx-3 text-gray-300">›</span>
                    <span className="text-blue-500 font-bold">{selectedDistrict.name}</span>
                </>
            )}
        </nav>

        {/* Content */}
        <div className="flex flex-col items-center justify-center space-y-12 lg:space-y-16 pt-6 lg:pt-10 px-4 animate-fade-in pb-20">
            {selectedProvince && (
                <div className="text-center w-full">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-2 lg:mb-4">Provinsi</h3>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight break-words">{selectedProvince.name}</h2>
                </div>
            )}

            {selectedRegency && (
                 <>
                    <div className="text-gray-200">
                        <ArrowDownIcon width="24" height="24" className="md:w-8 md:h-8" />
                    </div>
                    <div className="text-center w-full">
                        <h3 className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-2 lg:mb-4">Kota / Kabupaten</h3>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight break-words">{selectedRegency.name}</h2>
                    </div>
                 </>
            )}

            {selectedDistrict && (
                <>
                     <div className="text-gray-200">
                        <ArrowDownIcon width="24" height="24" className="md:w-8 md:h-8" />
                    </div>
                    <div className="text-center w-full">
                        <h3 className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-2 lg:mb-4">Kecamatan</h3>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight break-words">{selectedDistrict.name}</h2>
                    </div>
                </>
            )}
        </div>
      </main>
    </div>
  );
}
