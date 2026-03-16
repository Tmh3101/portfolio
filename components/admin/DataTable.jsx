'use client';

import React from 'react';
import { Edit2, Trash2, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * DataTable component for admin list views.
 *
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions: { key, label, render }.
 * @param {Array} props.data - Array of data objects to display.
 * @param {function} props.onEdit - Callback for the edit action.
 * @param {function} props.onDelete - Callback for the delete action.
 * @param {string} props.searchPlaceholder - Placeholder for the search input.
 * @param {function} props.onSearchChange - Callback for search input changes.
 * @param {function} props.onAddClick - Callback for the add button.
 * @param {string} props.addLabel - Label for the add button.
 * @param {boolean} props.isLoading - Loading state.
 */
const DataTable = ({
  columns,
  data = [],
  onEdit,
  onDelete,
  searchPlaceholder = 'Search...',
  onSearchChange,
  onAddClick,
  addLabel = 'Add New',
  isLoading = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Header / Actions bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="admin-form-input pl-10 h-10"
          />
        </div>

        {onAddClick && (
          <button onClick={onAddClick} className="admin-primary-button">
            <Plus className="w-4 h-4" />
            <span>{addLabel}</span>
          </button>
        )}
      </div>

      <div className="admin-table-shell">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                {(onEdit || onDelete) && <th className="w-24 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
                      </td>
                    ))}
                    <td className="text-right">
                      <div className="h-4 bg-gray-100 rounded w-16 ml-auto animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id || index}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? (
                          col.render(item[col.key], item)
                        ) : (
                          <span className="admin-table__primary">{item[col.key]}</span>
                        )}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="py-12 text-center text-gray-500 italic"
                  >
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        {data.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <p>
              Showing <strong>{data.length}</strong> entries
            </p>
            <div className="flex gap-2">
              <button disabled className="admin-pagination__button h-8 px-2">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button disabled className="admin-pagination__button h-8 px-2">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
