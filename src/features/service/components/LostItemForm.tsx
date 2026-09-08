import React, { useState } from 'react';
import { LostAndFoundItem, LostItemCategory, LostItemStatus } from '@/types/service';
import { FormField } from '@/components/ui/FormField';
import { useVehicles, useRoutes } from '@/hooks/useMasterData';
import { PackageSearch, Bus, GitFork, MapPin, User, Building2 } from 'lucide-react';

interface LostItemFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const LostItemForm: React.FC<LostItemFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { vehicles } = useVehicles();
  const { routes } = useRoutes();

  const [category, setCategory] = useState<LostItemCategory>('ELECTRONICS_AND_PHONES');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [foundOnRouteCode, setFoundOnRouteCode] = useState('');
  const [foundOnVehiclePlate, setFoundOnVehiclePlate] = useState('');
  const [custodyDepot, setCustodyDepot] = useState('Central Depot 1 Security Locker');
  const [finderType, setFinderType] = useState<'DRIVER' | 'PASSENGER' | 'DEPOT_CREW'>('DRIVER');
  const [finderName, setFinderName] = useState('');
  const [finderPhone, setFinderPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      category,
      itemName,
      description,
      color,
      brand,
      foundOnRouteCode,
      foundOnVehiclePlate,
      custodyDepot,
      status: 'FOUND_IN_CUSTODY' as LostItemStatus,
      finderType,
      finderName,
      finderPhone,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Item Category"
          as="select"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value as LostItemCategory)}
          options={[
            { label: 'Electronics & Mobile Phones', value: 'ELECTRONICS_AND_PHONES' },
            { label: 'Bags, Backpacks & Wallets', value: 'BAGS_AND_WALLETS' },
            { label: 'Official Documents & ID Cards', value: 'DOCUMENTS_AND_CARDS' },
            { label: 'Keys & Keychains', value: 'KEYS' },
            { label: 'Clothing & Apparel', value: 'CLOTHING_AND_APPAREL' },
            { label: 'Books & Stationery', value: 'BOOKS_AND_STATIONERY' },
            { label: 'Other Items', value: 'OTHER' },
          ]}
          icon={PackageSearch}
        />

        <FormField
          label="Item Title"
          required
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter item title"
        />
      </div>

      <FormField
        label="Detailed Description & Distinguishing Marks"
        as="textarea"
        required
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe item, markings, condition..."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Enter color"
        />

        <FormField
          label="Brand / Manufacturer"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Enter brand or manufacturer"
        />

        <FormField
          label="Custody Locker Depot"
          as="select"
          required
          value={custodyDepot}
          onChange={(e) => setCustodyDepot(e.target.value)}
          options={[
            { label: 'Central Depot 1 Security Locker', value: 'Central Depot 1 Security Locker' },
            { label: 'Central Depot 1 Lost & Found Desk', value: 'Central Depot 1 Lost & Found Desk' },
            { label: 'Industrial Depot 2 Custody Safe', value: 'Industrial Depot 2 Custody Safe' },
          ]}
          icon={Building2}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Found on Corridor Line"
          as="search-select"
          value={foundOnRouteCode}
          onChange={(e) => setFoundOnRouteCode(e.target.value)}
          options={[
            { label: 'None / Station Found', value: '' },
            ...routes.map((r) => ({
              label: `${r.routeCode} — ${r.routeName.split('↔')[0].trim()}`,
              value: r.routeCode,
            })),
          ]}
          placeholder="Search corridor (e.g. R01)..."
          icon={GitFork}
        />

        <FormField
          label="Found on Bus Vehicle"
          as="search-select"
          value={foundOnVehiclePlate}
          onChange={(e) => setFoundOnVehiclePlate(e.target.value)}
          options={[
            { label: 'None / Outside Bus', value: '' },
            ...vehicles.map((v) => ({
              label: `${v.registrationNumber} (${v.fleetNumber})`,
              value: v.registrationNumber,
            })),
          ]}
          placeholder="Search bus plate (e.g. KA 06, 8558)..."
          icon={Bus}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Finder Type"
          as="select"
          value={finderType}
          onChange={(e) => setFinderType(e.target.value as any)}
          options={[
            { label: 'Duty Driver', value: 'DRIVER' },
            { label: 'Fellow Passenger', value: 'PASSENGER' },
            { label: 'Depot Cleaning Crew', value: 'DEPOT_CREW' },
          ]}
        />

        <FormField
          label="Finder Name"
          value={finderName}
          onChange={(e) => setFinderName(e.target.value)}
          placeholder="Enter finder name"
        />

        <FormField
          label="Finder Phone Number"
          value={finderPhone}
          onChange={(e) => setFinderPhone(e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-brand-700 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-800 disabled:opacity-50"
        >
          {isLoading ? 'Registering...' : 'Register Item into Custody'}
        </button>
      </div>
    </form>
  );
};
