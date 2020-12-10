
function formatMessages(username,text){
    const time = Date().slice(16,21);
    return{
        username :username,
        text :text,
        time: time
    }
}
module.exports = formatMessages