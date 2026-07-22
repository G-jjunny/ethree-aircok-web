/**
 * 뉴스 게시물 타입.
 *
 * - BLOG: 에디터로 작성한 본문(content)을 가지는 블로그형 게시물.
 * - LINK: 외부 URL(externalUrl)로 연결되는 링크형 게시물. content 불필요.
 */
export enum NewsType {
  BLOG = 'BLOG',
  LINK = 'LINK',
}
