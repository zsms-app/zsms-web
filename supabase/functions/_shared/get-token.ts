export async function getToken(userSupabase, serviceSupabase) {
  let token;
  let phone_user_id;
  const ownTokenResult = await userSupabase.from("fcm_tokens").select("*");

  if (ownTokenResult.error) {
    return { error: ownTokenResult.error };
  }

  if (ownTokenResult.data.length) {
    return ownTokenResult.data[0];
  } else {
    const pairingResult = await userSupabase.from("pairings").select("*");
    if (pairingResult.error) {
      return { error: pairingResult.error };
    }
    const tokenResult = await serviceSupabase
      .from("fcm_tokens")
      .select("*")
      .eq("id", pairingResult.data[0].fcm_token_id);

    token = tokenResult.data[0].token;
    phone_user_id = tokenResult.data[0].phone_user_id;

    return tokenResult.data[0];
  }
}
