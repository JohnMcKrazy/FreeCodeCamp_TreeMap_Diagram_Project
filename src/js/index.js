document.addEventListener("DOMContentLoaded", () => {
    //! GLOBAL FUNCTIONS !//
    //^ REMOVE DUPLICATES IN ARRAY ^//

    const deleteDuplicatesInArray = (originalArray) => {
        let newArray = [];
        let lookupObject = {};
        for (let i in originalArray) {
            lookupObject[originalArray[i]] = originalArray[i];
        }
        for (let i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    };
    //^ DELETE CHILDREN ^//
    const deleteChildElements = (parentElement) => {
        let child = parentElement.lastElementChild;
        while (child) {
            parentElement.removeChild(child);
            child = parentElement.lastElementChild;
        }
    };
    const colorFade = (color) => d3.interpolateRgb(color, "#fff")(0.2);
    //! GLOBAL DATA  !//
    //^ VARIANTS - CONSTANTS  ^//
    const BODY = document.querySelector("body");
    const dataBtnTemplate = document.querySelector("#data_btn_template").content;
    const searchNav = document.querySelector(".search_nav");
    const SRC_DATA = [
        {
            key: "videogames",
            title: "Video Game Sales",
            description: "Top 100 Most Sold Video Games Grouped by Platform",
            api_link: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json",
        },
        {
            key: "movies",
            title: "Movie Sales",
            description: "Top 100 Highest Grossing Movies Grouped By Genre",
            api_link: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json",
        },
        {
            key: "kickstarter",
            title: "Kickstarter Pledges",
            description: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
            api_link: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json",
        },
    ];
    const mapDimentions = {
        width: 960,
        height: 570,
        padding: 2,
        item: 15,
        legend_offset: 10,
        legend_tile_padding: 2,
    };
    const colorRange = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"].map(colorFade);

    const color = d3.scaleOrdinal().range(colorRange);
    //^CREATING DATA BTNS ^//
    SRC_DATA.forEach((item) => {
        const newTemplate = dataBtnTemplate.cloneNode(true);
        const newBtn = newTemplate.querySelector(".data_btn");
        newBtn.innerHTML = item.title;
        newBtn.classList.add("flex");
        newBtn.classList.add("flex_c_c");
        newBtn.setAttribute("data-db", item.key);
        searchNav.append(newBtn);
    });
    // ^CREATING TIP ^//

    // ^ CREATE TOOLTIP ^ //
    const tooltip = d3
        .select(BODY)
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .html(
            `<h1 class="data_name"></h1>
<h2 class="data_category"></h2>
<p class="data_value" data-value=""></p>`
        );

    //^CREATING DESCRIPTION ^//
    const descriptionSection = d3.select(BODY).append("section").attr("id", "description_section").attr("class", "description_section flex flex_column_center");

    //^ CREATE TITLE  ^//
    const titleMap = descriptionSection.append("h1").attr("id", "title").attr("class", "title_map");
    const descriptionMap = descriptionSection.append("h2").attr("id", "description").attr("class", "description_map");
    const createTitle = (data) => {
        if (data.name === "Movies") {
            titleMap.html(SRC_DATA[1].title);
            descriptionMap.html(SRC_DATA[1].description);
        } else if (data.name === "Video Game Sales Data Top 100") {
            titleMap.html(SRC_DATA[0].title);
            descriptionMap.html(SRC_DATA[0].description);
        } else if (data.name === "Kickstarter") {
            titleMap.html(SRC_DATA[2].title);
            descriptionMap.html(SRC_DATA[2].description);
        }
    };

    //^ SET SVG  ^//
    //~ SET SVG CONTAINER ~//
    const mapSection = d3.select(BODY).append("section").attr("id", "map_section").attr("class", "map_section flex flex_column_center");
    const legendSection = d3.select(BODY).append("section").attr("id", "legend_section").attr("class", "legend_section flex flex_column_center");
    document.querySelector(".legend_section").style.width = mapDimentions.width + "px";
    //^ FETCH DATA   ^//
    let rawData = {};
    const fetchData = async (link) => {
        rawData = await d3.json(link);
        console.log(rawData);
        createTitle(rawData);

        //~ SET SVG~//
        const mapSVG = mapSection.append("svg").attr("class", "treemap").attr("id", "treemap").attr("width", mapDimentions.width).attr("height", mapDimentions.height);

        //^ SET TREEMAP AND CONDITIONS  ^//
        //~ SET TREEMAP ~//
        const treemap = d3.treemap().size([mapDimentions.width, mapDimentions.height]).paddingInner(mapDimentions.padding);
        //~ SET TREEMAP ROOT~//

        const root = d3
            .hierarchy(rawData)
            .eachBefore((data) => {
                return (data.data.id = (data.parent ? `${data.parent.data.id}.` : "") + data.data.name);
            })
            .sum((data) => data.value)
            .sort((item1, item2) => item2.height - item1.height || item2.value - item1.value);

        //~SET TREEMAP~//
        treemap(root);
        console.log(root.leaves());
        //^ SET TREEMAP CELLS  ^//
        const grill = mapSVG
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("class", "group")
            .attr("transform", (data) => `translate(${data.x0},${data.y0})`);

        grill
            .append("rect")
            .attr("id", (data) => data.data.id)
            .attr("class", "tile")
            .attr("width", (data) => data.x1 - data.x0)
            .attr("height", (data) => data.y1 - data.y0)
            .attr("data-name", (data) => data.data.name)
            .attr("data-category", (data) => data.data.category)
            .attr("data-value", (data) => data.value)
            .attr("fill", (data) => color(data.data.category));

        grill
            .append("text")
            .attr("class", "tile-text")
            .selectAll("tspan")
            .data((data) => data.data.name.split(/(?=[A-Z][^A-Z])/g))
            .enter()
            .append("tspan")
            .attr("x", 5)
            .attr("y", (data, item) => 12 + item * 10)
            .text((data) => data);
        grill
            .on("mouseenter", (event, data) => {
                /* console.log(event); */
                /* console.log(data); */
                tooltip
                    .style("opacity", 1)
                    .style("left", `${event.clientX + 15}px`)
                    .style("top", `${event.clientY - 100}px`);

                tooltip.attr("data-value", data.value);
                document.querySelector(".data_name").textContent = data.data.name;
                document.querySelector(".data_category").textContent = data.data.category;
                document.querySelector(".data_value").textContent = `Value: ${data.value}`;
            })
            .on("mouseleave", () => {
                tooltip.style("opacity", 0);
            });

        //^ SET CATEGORIES ^//
        let mapCategories = root.leaves().map((item) => item.data.category);
        console.log(mapCategories);

        const cleanCategoriesList = deleteDuplicatesInArray(mapCategories);
        console.log(cleanCategoriesList);

        //^SET LEGEND ^//

        const legendGroup = legendSection.append("g").attr("width", mapDimentions.width).attr("class", "legend_group").selectAll("g").data(cleanCategoriesList).enter();
        document.querySelector(".legend_group").style.width = mapDimentions.width + "px";

        const legend = legendGroup.append("g").attr("id", "legend").attr("class", "legend");
        legend
            .append("rect")
            .attr("class", "legend-item")
            .style("fill", (data) => color(data))
            .style("background", (data) => color(data));
        legend
            .append("text")
            .attr("class", "legend_text")
            .text((data) => data);
        //^ SET LEGENDS ^//
        setTimeout(() => {
            document.querySelector(".map_section").style.opacity = 1;
            document.querySelector(".description_section").style.opacity = 1;
            document.querySelector(".legend_section").style.opacity = 1;
        }, 100);
    };

    //^ PROJECTING FIRST DATA ^//
    fetchData(SRC_DATA[1].api_link);

    // ! ADD EVENT LISTENERS ! - START //
    //^ SET CLICK DATA BTNS ^//
    setTimeout(() => {
        const dataBtns = document.querySelectorAll(".data_btn");
        dataBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                console.log(btn.getAttribute("data-db"));
                const newSearch = SRC_DATA.filter((item) => {
                    if (item.key === btn.getAttribute("data-db")) {
                        return item;
                    }
                });
                document.querySelector(".map_section").style.opacity = 0;
                document.querySelector(".description_section").style.opacity = 0;
                document.querySelector(".legend_section").style.opacity = 0;
                setTimeout(() => {
                    deleteChildElements(document.querySelector("#map_section"));
                    deleteChildElements(document.querySelector("#legend_section"));
                    fetchData(newSearch[0].api_link);
                }, 500);
            });
        });
    }, 250);

    // ! ADD EVENT LISTENERS ! - OVER //

    // ! THEME AND TOP BTN ACTIONS - START ! //
    //^ THEME ACTIONS - START ^//
    const themeBtn = document.querySelector("#theme_btn");
    const btnThemeIconContainer = document.querySelector("#icon_theme_container");
    const sun = `<svg class='sun_icon icon_extra_btn' id='sun_icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path class='clr-1' d='M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z'/></svg>`;
    const moon = `<svg class='moon_icon icon_extra_btn' id='moon_icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path class='clr-1' d='M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z'/></svg>`;
    let currentTheme = "";
    let currentIcon = "";

    const changeTheme = (tm) => {
        const lightT = "light_theme";
        const darkT = "dark_theme";
        if (!tm) {
            const date = new Date();
            const time = date.getHours();
            const isNight = time < 8 || time > 17;
            switch (isNight) {
                case true:
                    currentTheme = darkT;
                    currentIcon = sun;
                    break;
                case false:
                    currentTheme = lightT;
                    currentIcon = moon;
                    break;
                default:
                    console.log("tienes un problema con tu funcion changeTheme");
                    return;
            }
        } else {
            switch (tm) {
                case lightT:
                    currentTheme = darkT;
                    currentIcon = sun;
                    break;
                case darkT:
                    currentTheme = lightT;
                    currentIcon = moon;
                    break;
            }
        }
        BODY.className = currentTheme;
        btnThemeIconContainer.innerHTML = currentIcon;
    };
    changeTheme();
    themeBtn.addEventListener("click", () => changeTheme(currentTheme));
    //^ THEME ACTIONS - OVER ^//
});
