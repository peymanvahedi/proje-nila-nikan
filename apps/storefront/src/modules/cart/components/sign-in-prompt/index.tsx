import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-center justify-between text-right">
      <div>
        <Heading level="h2" className="txt-xlarge">
          قبلاً حساب دارید؟
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          برای تجربهٔ بهتر وارد شوید.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="h-10"
            data-testid="sign-in-button"
          >
            ورود
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
