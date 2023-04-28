export const svgFilter = () => {
    // Source for the CSS filter:
    // https://codepen.io/sosuke/pen/Pjoqqp?__cf_chl_jschl_tk__=ecc0b72797ae71bc009d6322e3e470773936b386-1604211766-0-ASpz720gXnc6Ej0vzlgY9-KLmlPkldgcOx1wAmGTUCjLZLOxkArNxpRzZ9m8woL-NGmP9LBGVPws8UxMJZrR7O1qFH6QkKtrGVPw6StRnXiK1XTQR_nY905r0XobAG2nOmyC6Zq8mdyPDp1MyHD7JLodJUXCRViXhtmLmRVE_-JGarVJRlxs6k3DzAOQQEJewfp00DjhlD0mxr8ZKpk2yq6IPTZZQ52XYxh26FC5MxLHhs7LuAwhtolmDZyp4_IuwRg8I5m-2--MmvGE8CCqjRWrkE85zgkMXPlOqcZtppRpZhn6Uz9DZAuKheHwVBb0ySIhFYG92bvQOgiKX0TTswB1SHgOLIeqktuyUaAgxI_h
    // The tool has been used to pass from --secondary-color to --primary-color through CSS filters
    // This is because SVGs embedded into <img> tags can't be filled as we can do with inline SVGs
    return "invert(92%) sepia(17%) saturate(168%) hue-rotate(337deg) brightness(98%) contrast(89%)";
}