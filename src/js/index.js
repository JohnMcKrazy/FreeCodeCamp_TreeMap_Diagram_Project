document.addEventListener("DOMContentLoaded", () => {
    //! GLOBAL FUNCTIONS !//

    const deleteChildElements = (parentElement) => {
        let child = parentElement.lastElementChild;
        while (child) {
            parentElement.removeChild(child);
            child = parentElement.lastElementChild;
        }
    };
    //! GLOBAL DATA  !//
    //^ VARIANTS - CONSTANTS  ^//

    const body = document.querySelector("BODY");
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
    //^CREATING DESCRIPTION ^//

    const descriptionSection = d3.select("BODY").append("section").attr("id", "description_section").attr("class", "description_section flex flex_column_center");
    //^ CREATE TITLE  ^//

    const titleMap = descriptionSection.append("h1").attr("id", "title").attr("class", "title_map");
    const descriptionMap = descriptionSection.append("h2").attr("id", "descrition").attr("class", "description_map");
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

    //^ FETCH DATA   ^//
    const fetchData = async (link) => {
        const rawData = await d3.json(link);
        console.log(rawData);
        createTitle(rawData);
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
                fetchData(newSearch[0].api_link);
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
        const BODY = document.querySelector("body");
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
    //^ TO THE TOP ACTIONS - START ^//
    const topBtn = document.querySelector("#top_btn");
    const toTheTop = () => {
        const currentPosition = body.getBoundingClientRect().top;
        window.scrollTo(currentPosition, 0);
    };
    topBtn.addEventListener("click", toTheTop());
    // ! THEME AND TOP BTN ACTIONS - OVER ! //

    //^ TO THE TOP ACTIONS - OVER ^//
});
