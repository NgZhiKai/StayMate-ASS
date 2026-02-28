import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "../../contexts/NotificationContext";
import DropdownWrapper from "./DropdownWrapper";

interface Props {
  isOpen: boolean;
}

export default function NotificationDropdown({ isOpen }: Readonly<Props>) {
  const navigate = useNavigate();
  const { notifications } = useNotificationContext();

  const unreadCount = notifications.filter((n) => n.isread === false).length;

  const topFive = useMemo(() => {
    return [...notifications]
      .sort((a, b) => {
        if (a.isread !== b.isread) {
          return a.isread ? 1 : -1;
        }
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      })
      .slice(0, 5);
  }, [notifications]);

  return (
    <DropdownWrapper isOpen={isOpen}>
      <div className="w-[360px] bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100 p-4">
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold">Notifications</h3>
          <span className="text-xs text-gray-500">
            {unreadCount} unread
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none">
          {topFive.length === 0 ? (
            <p className="text-sm text-gray-400">
              No notifications.
            </p>
          ) : (
            topFive.map((n) => (
              <button
                type="button"
                key={n.id}
                onClick={() => navigate("/notifications")}
                className={`w-full text-left p-3 rounded-xl transition ${
                  n.isread === false
                    ? "bg-indigo-50 hover:bg-indigo-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <p className="text-sm font-medium">
                  {n.message}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => navigate("/notifications")}
            className="w-full text-sm font-semibold text-indigo-600"
          >
            View all →
          </button>
        </div>
      </div>
    </DropdownWrapper>
  );
}
