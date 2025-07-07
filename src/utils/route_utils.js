export function filterObjectByFields(obj, fields) {
    const filteredObj = {};
    for (const field of fields) {
        if (obj.hasOwnProperty(field)) {
            filteredObj[field] = obj[field];
        } else {
            throw new Error(`Field '${field}' does not exist.`);
        }
    }
    return filteredObj;
}
