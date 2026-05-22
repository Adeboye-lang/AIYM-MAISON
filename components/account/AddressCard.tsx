"use client";

import { Address } from "@/lib/types";

interface AddressCardProps {
  address: Address;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3">
      {address.isDefault && (
        <span className="inline-block bg-brand-yellow text-brand-brown text-[10px] font-bold uppercase tracking-wide px-2 py-0.5">
          Default
        </span>
      )}
      <div className="text-sm text-brand-brown space-y-0.5">
        <p className="font-medium">{address.firstName} {address.lastName}</p>
        <p className="text-brand-brown-mid">{address.line1}</p>
        {address.line2 && <p className="text-brand-brown-mid">{address.line2}</p>}
        <p className="text-brand-brown-mid">{address.city}, {address.postcode}</p>
        <p className="text-brand-brown-mid">{address.phone}</p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button onClick={onEdit} className="text-xs text-brand-yellow hover:underline">Edit</button>
        <button onClick={onDelete} className="text-xs text-red-500 hover:underline">Delete</button>
        {!address.isDefault && (
          <button onClick={onSetDefault} className="text-xs text-brand-brown-mid hover:text-brand-brown hover:underline">
            Set as default
          </button>
        )}
      </div>
    </div>
  );
}
