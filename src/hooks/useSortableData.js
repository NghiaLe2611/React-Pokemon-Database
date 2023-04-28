import { useState, useMemo } from 'react';

export const SORT_ASC = 'asc';
export const SORT_DESC = 'desc';

export const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            if (sortConfig.direction === '') return sortableItems; // return default order

            sortableItems.sort((a, b) => {  
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === SORT_ASC ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === SORT_ASC ? 1 : -1;
                }
                
                return 0;
            });
        }

        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = SORT_ASC;
        if (sortConfig && sortConfig.key === key) {
            switch (sortConfig.direction) {
                case SORT_ASC: {
                    direction = SORT_DESC; 
                    break;
                }
                case SORT_DESC: {
                    direction = ''; 
                    break;
                }
                case '': {
                    direction = SORT_ASC; 
                    break;
                }
                default: return;
            }
        }

        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};
