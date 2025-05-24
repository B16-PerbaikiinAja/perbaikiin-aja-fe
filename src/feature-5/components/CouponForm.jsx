// src/coupon-feature/component/CouponForm.jsx
import { useState } from 'react';

const CouponForm = ({ initialData = {}, onSubmit, submitText = "Submit" }) => {
    const [discountValue, setDiscountValue] = useState(initialData.discountValue || '');
    const [maxUsage, setMaxUsage] = useState(initialData.maxUsage || '');
    const [expiryDate, setExpiryDate] = useState(
        initialData.expiryDate ? initialData.expiryDate.slice(0, 10) : ''
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!discountValue || !maxUsage || !expiryDate) {
            alert('All fields are required');
            return;
        }

        const payload = {
            discountValue: parseFloat(discountValue),
            maxUsage: parseInt(maxUsage, 10),
            expiryDate,
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 font-medium">Discount Value (%)</label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Max Usage</label>
                <input
                    type="number"
                    min="1"
                    value={maxUsage}
                    onChange={(e) => setMaxUsage(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Expiry Date</label>
                <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {submitText}
            </button>
        </form>
    );
};

export default CouponForm;
