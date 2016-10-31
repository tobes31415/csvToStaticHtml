function isNullOrEmpty(text)
{
    return !text || typeof text !== "string" || text.length === 0;
}

exports.processData = function(rawData)
{
    data = {};
    
    var rituals = {};
    rawData.forEach(function(row)
    {
        var rid = row['Ritual Id'];
        var ritual = rituals[rid];
        if (!ritual)
        {
            //console.log("Defining ", rid);
            ritual = {"Ritual Id":rid, Name:row.Name, Variants:[], Base:row};
            rituals[rid] = ritual;
        }
        var base = ritual.Base;
        for (var key in base)
        {
            if (isNullOrEmpty(row[key]))
            {
                row[key]=base[key];
            }
        }
        //console.log("Adding "+ row.Name+ " to "+ rid);
        ritual.Variants.push(row);
    });
    data.Rituals = [];
    for(var key in rituals)
    {
        data.Rituals.push(rituals[key]);
    }
    
    return data;
};