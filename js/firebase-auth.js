// firestore + auth import tu config
class User {
  constructor(uid) {
    this.uid = uid;
    this.userRef = doc(firestore, "users", uid);
  }

  // Create a new user document after sign-up
  async createUser() {}

  // Get user profile
  async getUserInfo() {
    // return obj user }
  }
}

export default User;
