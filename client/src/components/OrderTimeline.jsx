import { CheckCircle, Circle, XCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';

const STEPS = [
  {
    status: 'pending',
    label: 'Order Placed',
    icon: ShoppingBag,
    description: 'Your order has been received'
  },
  {
    status: 'processing',
    label: 'Processing',
    icon: Package,
    description: 'Your order is being prepared'
  },
  {
    status: 'shipped',
    label: 'Shipped',
    icon: Truck,
    description: 'Your order is on the way'
  },
  {
    status: 'delivered',
    label: 'Delivered',
    icon: Home,
    description: 'Your order has been delivered'
  },
];

const OrderTimeline = ({ status, timeline = [] }) => {
  const isCancelled = status === 'cancelled';

  // get timestamp for a status from timeline array
  const getTimestamp = (stepStatus) => {
    const entry = timeline.find(t => t.status === stepStatus);
    if (!entry) return null;
    return new Date(entry.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // which step index is current
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="mt-6">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-5">
        Order Timeline
      </p>

      {/* Cancelled state */}
      {isCancelled ? (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
          <XCircle size={22} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-500">Order Cancelled</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {getTimestamp('cancelled') || 'Date unavailable'}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isDone = index < currentIndex;
            const isActive = index === currentIndex;
            const isPending = index > currentIndex;
            const timestamp = getTimestamp(step.status);
            const isLast = index === STEPS.length - 1;

            return (
              <div key={step.status} className="flex gap-4">

                {/* Left — icon + connector line */}
                <div className="flex flex-col items-center">

                  {/* Icon circle */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isDone
                      ? 'bg-green-500 text-white shadow-md shadow-green-200 dark:shadow-green-900/30'
                      : isActive
                        ? 'bg-primary-500 text-white shadow-md shadow-primary-200 dark:shadow-primary-900/30 ring-4 ring-primary-100 dark:ring-primary-900/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                  }`}>
                    {isDone
                      ? <CheckCircle size={18} />
                      : <Icon size={16} />
                    }
                  </div>

                  {/* Connector line */}
                  {!isLast && (
                    <div className={`w-0.5 flex-1 my-1 min-h-[32px] rounded-full transition-all duration-500 ${
                      isDone ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>

                {/* Right — content */}
                <div className={`pb-6 flex-1 ${isLast ? 'pb-0' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold ${
                        isDone
                          ? 'text-green-600 dark:text-green-400'
                          : isActive
                            ? 'text-primary-500'
                            : 'text-gray-400 dark:text-gray-600'
                      }`}>
                        {step.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${
                        isPending
                          ? 'text-gray-300 dark:text-gray-600'
                          : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Timestamp */}
                    {timestamp && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5">
                        {timestamp}
                      </span>
                    )}

                    {/* Pending badge */}
                    {isPending && !isCancelled && (
                      <span className="text-xs text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;