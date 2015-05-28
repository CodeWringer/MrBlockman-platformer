// ---- HelperMaths ---- //
Crafty.c("HelperMaths", 
{
    getPointOnCirlce: function(originPointIn, curPointIn, curAngleIn) 
    {
        var resultPoint = { x: 0, y: 0 };
        // u = originPoint.x
        // v = originPoint.y
        // x' = (x-u) cos(beta) - (y-v) sin(beta) + u
        // y' = (x-u) sin(beta) + (y-v) cos(beta) + v
        resultPoint.x = (curPointIn.x - originPointIn.x) * Math.cos(curAngleIn) - (curPointIn.y - originPointIn.y) * Math.sin(curAngleIn) + originPointIn.x;
        resultPoint.y = (curPointIn.x - originPointIn.x) * Math.sin(curAngleIn) + (curPointIn.y - originPointIn.y) * Math.cos(curAngleIn) + originPointIn.y;
        return resultPoint;
    },

    getVector: function(pointA, pointB) 
    {
        // pointA = origin
        // pointB = target
        return { x: (pointB.x - pointA.x), y: (pointB.y - pointA.y) };
    },

    getCosAngle: function(vectorA, vectorB) // cos alpha, range from -1 to 1
    { 
        // cos alpha = (vectorA*vectorB) / (|vectorA|*|vectorB|)
        // cos alpha = ((a.x*b.x) + (a.y*b.y)) / (Math.sqrt(a.x²+a.y²) * Math.sqrt(b.x²+b.y²))
        return (this.getScalarProduct(vectorA, vectorB) / (this.getVectorLength(vectorA) * this.getVectorLength(vectorB)));
    },

    getCosDegAngle: function(angleIn) 
    {
        return (Math.acos(angleIn) * (180/Math.PI));
    },

    getAtan2DegAngle: function(pointA, pointB) 
    {
        // pointA = origin
        // pointB = target
        return (Math.atan2((pointB.y - pointA.y), (pointB.x - pointA.x)) * (180/Math.PI));
    },

    getScalarProduct: function(vectorA, vectorB) // vector²
    { 
        // (vectorA*vectorB)
        // (a.x*b.x) + (a.y*b.y)
        return ((vectorA.x * vectorB.x) + (vectorA.y * vectorB.y));
    },

    getVectorLength: function(vector) // |vector|
    { 
        // Math.sqrt(vectorA²)
        return (Math.sqrt(vector.x*vector.x + vector.y*vector.y));
    },
});