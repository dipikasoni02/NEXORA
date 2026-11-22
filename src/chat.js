// NEXORA - Nexconn Chat Integration

import { NCEngine, DirectChannelIdentifier } from '@nexconn/chat';
import { NCChatUIApplication } from '@nexconn/chatui';

const APP_KEY = 'n19jmcy5nwz19';

// HACKATHON ONLY: token generated manually in the Nexconn console
const TEST_TOKEN ='Ngsvg9DVTcoHYFYBrMbU1CO1teOUwyeVhbGFYt8hbEM=@y8ix.sg.rongnav.com;y8ix.sg.rongcfg.com';
    

const hooks = {
  async reqUserProfiles(userIds) {
    return userIds.map(userId => ({
      userId,
      name: `User ${userId}`
    }));
  },

  async reqGroupProfiles(groupIds) {
    return groupIds.map(groupId => ({
      groupId,
      name: `Group ${groupId}`,
      memberCount: 0
    }));
  },

  async reqGroupMembers(groupId) {
    return [
      { userId: 'user-01', nickname: 'Member 01' },
      { userId: 'user-02' }
    ];
  },

  async reqSystemProfiles(systemIds) {
    return systemIds.map(systemId => ({
      systemId,
      name: `System ${systemId}`
    }));
  }
};

export async function initializeNexconn() {
  try {
    // 1. Initialize Nexconn Engine
    NCEngine.initialize({
      appKey: APP_KEY
    });

    // 2. Initialize Chat UI
    const app = NCChatUIApplication.initialize({
      hooks,
      language: 'en_US'
    });

    if (!app) {
      throw new Error('ChatUI initialization failed');
    }

    // 3. Register Chat UI components
    app.ready();

    // 4. Connect to Nexconn using the test token
    const result = await NCEngine.connect({ token: TEST_TOKEN });

    if (!result.isOk) {
      throw new Error(`Nexconn connection failed: ${result.code}`);
    }

    console.log('NEXORA: Nexconn connected successfully!');

    return app;

  } catch (error) {
    console.error('NEXORA chat error:', error);
    throw error;
  }
}
export async function mountChat(app) {
  const box = document.getElementById('nexconn-chat');
  if (!box) return;
  box.innerHTML = '';
  box.style.height = '75vh';

  const root = document.createElement('nc-chat-ui-app-provider');
  root.style.width = '100%';
  root.style.height = '100%';
  box.appendChild(root);

  try {
    if (app.ifReady()) {
      await app.openChannel(new DirectChannelIdentifier('user-02'), true);
    }
  } catch (e) {
    console.warn('Could not open channel', e);
  }
}