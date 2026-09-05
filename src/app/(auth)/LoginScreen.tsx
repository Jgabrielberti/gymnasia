import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppBackground } from "@/src/components/generic/AppBackground";
import { AuthBackground } from "@/src/components/auth/AuthBackground";
import { AuthLoginForm } from "@/src/components/auth/AuthLoginForm";

export default function LoginScreen() {
  return (
    <AppBackground>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={40}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <AuthBackground>
          <AuthLoginForm />
        </AuthBackground>
      </KeyboardAwareScrollView>
    </AppBackground>
  );
}