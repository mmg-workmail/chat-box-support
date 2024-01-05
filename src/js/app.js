const { createApp, ref, onMounted } = Vue
createApp({
  setup() {

    //common variable
    const loading = ref(false);
    const API_BASE = ref('https://limoo.ai/api/v1');
    const API_KEY = ref('Api-Key gAAAAABllBNzdrP27Wg9CiadT4idWPt0zvIr2XKZFqdAQUcekmodySV1EN-mDbSnsvu2zTe0EqgJ7a74YkNX8e7yYfqtjS3wTMyWdoQ5OKbfB8L4MLVYHdGOd5HOcSgySoNtMp-zPCSw');

    // btn chat
    const btnTitle = ref('Chat with the bot');
    const btnSend = ref('Send');
    const messageText = ref('');
    const user = ref('guest');
    const openChat = ref(false);
    const storage = 'myAccontRobot'
    function toggleOpenChat() {
      openChat.value = !openChat.value;
    }

    // messages & chat
    const messages = ref([
      {
        title: 'اگه سوالی در رابطه با سیستم دارید من در خدمت هستم؟',
      },
      {
        title: 'من می تونم در رابطه با پکیج ها اطلاعات کافی خدمت شما ارائه بدم من می تونم در رابطه با پکیج ها اطلاعات کافی خدمت شما ارائه بدم',
      },
      {
        title: 'در مورد اسپرد های ما سوالی دارید؟',
      }
    ]);
    const selectedFirstMessage = ref(messages.value[Math.floor(Math.random() * messages.value.length)].title);
    const chat = ref([]);


    function setScroll() {
      setTimeout(() => {
        const chatbox = document.getElementById("chatbox");
        chatbox.scrollTop = chatbox.scrollHeight;
      }, 10);
    }
    function makeid(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }
    function setLocalStorage(user) {
      localStorage.setItem(storage, user);
    }
    function getLocalStorage() {
      return localStorage.getItem(storage);
    }
    function checkUser() {
      let hasUser = false;
      const account = getLocalStorage();

      if (account) {
        user.value = account;
        hasUser = true;
      } else {
        user.value = makeid(10);
      }
      return hasUser
    }
    async function sendMessage() {
      loading.value = true;
      const message = messageText.value;
      messageText.value = '';
      chat.value.push({
        message: message,
        role: 'user'
      });
      setScroll()
      const { data, error } = await useFetch(`${API_BASE.value}/support`, {
        method: "POST",
        body: JSON.stringify(
          {
            username: user.value,
            text: message
          }
        ),
        headers: {
          "Content-Type": "application/json",
          "Authorization": API_KEY.value
        },
      });
      setLocalStorage(user.value);
      chat.value = data.value?.result || [];
      setScroll()
      loading.value = false;
    }
    async function getChat() {
      loading.value = true;
      const { data, error } = await useFetch(`${API_BASE.value}/support/${user.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": API_KEY.value
        },
      });
      chat.value = data.value.result;
      loading.value = false;
      setScroll()
    }
    async function setStatus(item, type = 1) {
      loading.value = true;
      const { data, error } = await useFetch(`${API_BASE.value}/like`, {
        method: "POST",
        body: JSON.stringify(
          {
            id: item.id,
            like: type
          }
        ),
        headers: {
          "Content-Type": "application/json",
          "Authorization": API_KEY.value
        },
      });
      if (!error.value) {
        item.like = type
      }
      loading.value = false;
    }
    async function useFetch(url, requestInit = {}) {
      const data = ref(null)
      const error = ref(null)

      await fetch(url, requestInit)
        .then((res) => res.json())
        .then((json) => (data.value = json))
        .catch((err) => (error.value = err))

      return { data, error }
    }

    onMounted(async () => {
      if (checkUser()) {
        await getChat();
      }
    });

    return {
      loading,
      btnTitle,
      btnSend,
      openChat,
      messages,
      selectedFirstMessage,
      chat,
      messageText,
      toggleOpenChat,
      sendMessage,
      setStatus
    }
  }
}).mount('#app')