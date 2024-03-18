async function getScanCount(codeId) {
    const code = await codes.findOne({ code: codeId });
    const visits = code.visits;
    const uniqueVisits = [...new Set(visits.map(item => item.visitor_id))];
    return { totalScans: visits.length, uniqueScans: uniqueVisits.length };
}


async function getUserScanCount(userId) {
    const userCodes = await codes.find({ created_by: userId });
    const scans = userCodes.flatMap(code => code.visits);
    const uniqueScans = [...new Set(scans.map(item => item.visitor_id))].length;
    return { totalScans: scans.length, uniqueScans };
}

module.exports = { getScanCount, getUserScanCount }