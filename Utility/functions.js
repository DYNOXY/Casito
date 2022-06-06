const { Queue } = require("erela.js");

module.exports = {
  getParams: function (func) {
    var str = func.toString();
    str = str
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/(.)*/g, "")
      .replace(/{[\s\S]*}/, "")
      .replace(/=>/g, "")
      .trim();
    var start = str.indexOf("(") + 1;
    var end = str.length - 1;
    var result = str.substring(start, end).split(", ");
    var params = [];
    result.forEach((element) => {
      element = element.replace(/=[\s\S]*/g, "").trim();
      if (element.length > 0) params.push(element);
    });
    return params;
  },
  /**
   *
   * @param {Queue} queueList
   */
  getQueue: (queueList) => {
    const { current } = queueList;

    let i = 1;
    let finalQueue = [];
    if (!queueList.length) {
      finalQueue.push(`Empty! Send Song Name To add Music to Queue!`);
    } else {
      queueList.map((e) => {
        finalQueue.push(`${i}. ${e.title} - **${e.requester.tag}**!`);
        i++;
      });
    }
    finalQueue = finalQueue.slice(0, 25);
    if (queueList.length > 25) {
      finalQueue.push(`26. **...** ${queueList.length}`);
    }
    finalQueue.reverse();
    if (current) {
      finalQueue.push(`**__Current :-__\n● ${current?.title}** - **${current.requester.tag}**!`);
    }

    return finalQueue.join("\n");
  },
};