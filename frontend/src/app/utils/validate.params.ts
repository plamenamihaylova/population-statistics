import { ASC, DESC } from "../shared/constants/variables";
import { appropriateSortProperties } from "../shared/models";

export const validateSortProperty = (sortProperty: string): boolean => {
    if (appropriateSortProperties.includes(sortProperty)) return true;
    return false;
}

export const validateSortOrder = (sortOrder: string): boolean => {
    if (sortOrder !== ASC && sortOrder !== DESC) return false;
    return true;
}