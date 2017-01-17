// Include namespaces. 
var utility = utility || {};

/** 
* @namespace
* @desc Static global object that provides access to common mathematical operations. 
*/
utility.Maths = {
    /**
    * Returns a point on the edge of a circle. 
    * @param {Point} circleOrigin - Origin point of the circle. 
    * @param {Point} curPointIn - A point to which a line will be 
    * calulated. Where that line intersects the circle is the point that 
    * will be returned. 
    * @param {Number} angle - An angle. 
    * @memberof utility.Maths
    * @public
    * @returns {Point} The calculated point on the edge of the circle. 
    */
    getPointOnCircle: function(circleOrigin, curPointIn, angle) 
    {
        var resultPoint = { x: 0, y: 0 };
        // u = originPoint.x
        // v = originPoint.y
        // x' = (x-u) cos(beta) - (y-v) sin(beta) + u
        // y' = (x-u) sin(beta) + (y-v) cos(beta) + v
        resultPoint.x = (curPointIn.x - circleOrigin.x) * Math.cos(angle) - (curPointIn.y - circleOrigin.y) * Math.sin(angle) + circleOrigin.x;
        resultPoint.y = (curPointIn.x - circleOrigin.x) * Math.sin(angle) + (curPointIn.y - circleOrigin.y) * Math.cos(angle) + circleOrigin.y;
        return resultPoint;
    },

    /**
    * Returns a vector spanning from pointA to pointB. 
    * @param {Point} pointA - The starting point. 
    * @param {Point} pointB - The ending point. 
    * @memberof utility.Maths
    * @public
    * @returns {Vector} 
    */
    getVector: function(pointA, pointB) 
    {
        // pointA = origin
        // pointB = target
        return { x: (pointB.x - pointA.x), y: (pointB.y - pointA.y) };
    },

    /**
    * Returns the cosine angle between two given vectors. 
    * @param {Vector} vectorA 
    * @param {Vector} vectorB
    * @memberof utility.Maths
    * @public
    * @returns {Number} 
    */
    getCosAngle: function(vectorA, vectorB) // cos alpha, range from -1 to 1
    { 
        // cos alpha = (vectorA*vectorB) / (|vectorA|*|vectorB|)
        // cos alpha = ((a.x*b.x) + (a.y*b.y)) / (Math.sqrt(a.x²+a.y²) * Math.sqrt(b.x²+b.y²))
        return (this.getScalarProduct(vectorA, vectorB) / (this.getVectorLength(vectorA) * this.getVectorLength(vectorB)));
    },

    /** 
    * Returns a given radiants angle converted into a degrees angle. 
    * @param {Number} radAngle - An angle, in radians. 
    * @memberof utility.Maths
    * @public
    * @returns {Number} - The angle, in degrees. 
    */
    getDegAngle: function(radAngle) 
    {
        return (Math.acos(radAngle) * (180/Math.PI));
    },

    /** 
    * Returns a degrees angle between two given points. 
    * @param {Point} pointA
    * @param {Point} pointB
    * @memberof utility.Maths
    * @public
    * @returns {Number} - The angle between the given points. 
    */
    getAtan2DegAngle: function(pointA, pointB) 
    {
        // pointA = origin
        // pointB = target
        return (Math.atan2((pointB.y - pointA.y), (pointB.x - pointA.x)) * (180/Math.PI));
    },

    /** 
    * Returns the scalar product of two given vectors. 
    * @param {Vector} vectorA
    * @param {Vector} vectorB
    * @memberof utility.Maths
    * @public
    * @returns {Number}
    */
    getScalarProduct: function(vectorA, vectorB) // vector²
    { 
        // (vectorA*vectorB)
        // (a.x*b.x) + (a.y*b.y)
        return ((vectorA.x * vectorB.x) + (vectorA.y * vectorB.y));
    },

    /** 
    * Returns the absolute length of a given vector. 
    * @param {Vector} vector
    * @memberof utility.Maths
    * @public
    * @returns {Number}
    */
    getVectorLength: function(vector)
    { 
        // Math.sqrt(vector) = |vector|
        return (Math.sqrt(vector.x*vector.x + vector.y*vector.y));
    },

    /**
    * Returns a normalized (unit length) vector. 
    * @param {Vector} vector
    * @memberof utility.Maths
    * @public
    * @returns {Vector}
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
    * @param {Vector} vector
    * @param {Number} factor
    * @memberof utility.Maths
    * @public
    * @returns {Vector}
    */
    getScaledVector: function(vector, factor)
    {
        return { x: (vector.x * factor), y: (vector.y * factor) };
    },

    /** 
    * Returns a random value between a given minimum and maximum value. 
    * @param {Number} min
    * @param {Number} max
    * @memberof utility.Maths
    * @public
    * @returns {Number}
    */
    getRandomArbitrary: function(min, max) 
    {
        return Math.random() * (max - min) + min;
    },

    /** 
    * Returns the distance between two given points. 
    * Setting naive to true will give less accurate, approximated, but faster results. 
    * @param {Point} pointA
    * @param {Point} pointB
    * @param {Boolean} naive
    * @memberof utility.Maths
    * @public
    * @returns {Number}
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