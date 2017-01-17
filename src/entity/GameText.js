Crafty.c("GameText", 
{
    init: function()
    {
        this.requires("2D, DOM, Text");
        this.attr({ w: 800, h: 20 });
        this.textFont($text_css);
    },
});