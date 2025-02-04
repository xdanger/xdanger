module Jekyll
    module MyFilter

        def abs(input)
            input.to_i.abs
        end

        def nearby_paginator(x, y)
            (x - y).abs < 6
        end

    end
end

Liquid::Template.register_filter(Jekyll::MyFilter)
