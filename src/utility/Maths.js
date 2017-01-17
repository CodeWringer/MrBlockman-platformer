/*
* Static global object that provides access to common mathematical operations. 
*/
var Maths = 
{
    /*
    * 
    */
    getPointOnCircle: function(originPointIn, curPointIn, curAngleIn) 
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

    /*
    * Returns a vector spanning from pointA to pointB. 
    */
    getVector: function(pointA, pointB) 
    {
        // pointA = origin
        // pointB = target
        return { x: (pointB.x - pointA.x), y: (pointB.y - pointA.y) };
    },

    /*
    * Returns the cosine angle between two given vectors. 
    */
    getCosAngle: function(vectorA, vectorB) // cos alpha, range from -1 to 1
    { 
        // cos alpha = (vectorA*vectorB) / (|vectorA|*|vectorB|)
        // cos alpha = ((a.x*b.x) + (a.y*b.y)) / (Math.sqrt(a.x²+a.y²) * Math.sqrt(b.x²+b.y²))
        return (this.getScalarProduct(vectorA, vectorB) / (this.getVectorLength(vectorA) * this.getVectorLength(vectorB)));
    },

    /*
    * Returns a given radiants angle converted into a degrees angle. 
    */
    getDegAngle: function(radAngle) 
    {
        return (Math.acos(radAngle) * (180/Math.PI));
    },

    /*
    * Returns a degrees angle between two given points. 
    */
    getAtan2DegAngle: function(pointA, pointB) 
    {
        // pointA = origin
        // pointB = target
        return (Math.atan2((pointB.y - pointA.y), (pointB.x - pointA.x)) * (180/Math.PI));
    },

    /*
    * Returns the scalar product of two given vectors. 
    */
    getScalarProduct: function(vectorA, vectorB) // vector²
    { 
        // (vectorA*vectorB)
        // (a.x*b.x) + (a.y*b.y)
        return ((vectorA.x * vectorB.x) + (vectorA.y * vectorB.y));
    },

    /*
    * Returns the absolute length of a given vector. 
    */
    getVectorLength: function(vector)
    { 
        // Math.sqrt(vector) = |vector|
        return (Math.sqrt(vector.x*vector.x + vector.y*vector.y));
    },

    /**
    * Returns a normalized (unit length) vector. 
    */
    getNormalizedVector: function(vector)
    {
        // 1. Get vector magnitude. 
        // 2. Divide each of its components (xy) or (xyz) by the magnitude. 
        var magnitude = this.getVectorLength(vector);
        return { x: (vector.x / magnitude), y: (vector.y / magnitude) };
    },

    /**
    * Returns a copy of the given vector with its components scaled by the given factor. 
    */
    getScaledVector: function(vector, factor)
    {
        return { x: (vector.x * factor), y: (vector.y * factor) };
    },

    /*
    * Returns a random value between a given minimum and maximum value. 
    */
    getRandomArbitrary: function(min, max) 
    {
        return Math.random() * (max - min) + min;
    },

    /*
    * Returns the distance between two given points. 
    * Setting naive to true will give less accurate, approximated, but faster results. 
    */
    getDistance: function(pointA, pointB, naive) {
        if (naive == true)
        {
            return (pointA.x - pointB.x) + (pointA.y - pointB.y);
        }
        else
        {
            var vector = this.getVector(pointA, pointB);
            return this.getVectorLength(vector);
        }
    },
};