import { DefaultProcessorOptions } from "../../__tests__/constants/default-processor-options";
import { generateIIssue } from "../../__tests__/functions/generate-iissue";
import { IIssue } from "../interfaces/issue";
import { IIssuesProcessorOptions } from "../interfaces/issues-processor-options";
import { Author } from "./author";
import { Issue } from "./issue";

describe("Authors", (): void => {
  let author: Author;
  let optionsInterface: IIssuesProcessorOptions;
  let issue: Issue;
  let issueInterface: IIssue;

  beforeEach((): void => {
    optionsInterface = {
      ...DefaultProcessorOptions,
    };
    issueInterface = generateIIssue();
  });

  describe("should exempt", (): void => {
    it("because issue.user is one of options.anyOfAuthors", (): void => {
      optionsInterface.anyOfAuthors = "foo,bar,foobar123";
      issueInterface.user = { type: "User", login: "foobar123" };

      expect.assertions(1);
      issue = new Issue(optionsInterface, issueInterface);
      author = new Author(optionsInterface, issue);

      const result = author.shouldExemptAuthor();

      expect(result).toStrictEqual(true);
    });
  });

  describe("should not exempt", (): void => {
    it("because options.anyOfAuthors is not set", (): void => {
      optionsInterface.anyOfAuthors = "";
      issueInterface.user = null;
      expect.assertions(1);
      issue = new Issue(optionsInterface, issueInterface);
      author = new Author(optionsInterface, issue);

      const result = author.shouldExemptAuthor();

      expect(result).toStrictEqual(false);
    });

    it("because issue.user is not set", (): void => {
      optionsInterface.anyOfAuthors = "foo,bar";
      issueInterface.user = null;

      expect.assertions(1);
      issue = new Issue(optionsInterface, issueInterface);
      author = new Author(optionsInterface, issue);

      const result = author.shouldExemptAuthor();

      expect(result).toStrictEqual(false);
    });

    it("because issue.user is not one of options.anyOfAuthors", (): void => {
      optionsInterface.anyOfAuthors = "foo,bar";
      issueInterface.user = { type: "User", login: "foobar123" };

      expect.assertions(1);
      issue = new Issue(optionsInterface, issueInterface);
      author = new Author(optionsInterface, issue);

      const result = author.shouldExemptAuthor();

      expect(result).toStrictEqual(false);
    });
  });
});
