const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
            headers: {
                'Content-type': 'application/JSON'
            },
            body: data
    });

    return await res.json();
};

const getMenuInfo = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Couldn't fetch ${url}, status: $${res.status}`);
    }

    return await res.json();
};

export {postData};
export {getMenuInfo};
