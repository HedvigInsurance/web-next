import { colors } from '@hedviginsurance/brand'
import * as React from 'react'
import styled from 'react-emotion'
import { ContentWrapper, SectionWrapper } from '../components/blockHelpers'
import { BaseBlockProps, MarkdownHtmlComponent } from './BaseBlockProps'

const PlainTextSectionWrapper = styled(SectionWrapper)({
  paddingBottom: '0 !important',
})

const TitleWrapper = styled('div')({
  paddingBottom: '2.5rem',
})

const ContentColorWrapper = styled('div')({
  backgroundColor: colors.WHITE,
  color: colors.OFF_BLACK_DARK,
})
const InnerContent = styled('div')({
  maxWidth: '40rem',
})

export interface PlainTextBlockProps extends BaseBlockProps {
  title: string
  content: MarkdownHtmlComponent
}

export const PlainTextBlock: React.FunctionComponent<PlainTextBlockProps> = ({
  color,
  title,
  content,
  size,
}) => (
  <PlainTextSectionWrapper color={color && color.color} size={size}>
    <ContentWrapper>
      <TitleWrapper>
        <h1>{title}</h1>
      </TitleWrapper>
    </ContentWrapper>
    <ContentColorWrapper>
      <ContentWrapper>
        <InnerContent
          dangerouslySetInnerHTML={{ __html: content && content.html }}
        />
      </ContentWrapper>
    </ContentColorWrapper>
  </PlainTextSectionWrapper>
)
