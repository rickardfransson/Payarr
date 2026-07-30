export function openSwish(url: string) {
    const link = document.createElement("a");

    link.href = url;
    link.target = "_self";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}