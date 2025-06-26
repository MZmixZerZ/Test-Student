export interface CommonSearch {
  keyword?: string;
  startDate?: Date;
  endDate?: Date;
};

export interface SearchConfig {
    placeholder: {
        keyword: string;
        startDate?: string;
        endDate?: string;
    };
    label: {
        keyword: string;
        rangeDate?: string;
    };
    useRangeDate?: boolean;
};